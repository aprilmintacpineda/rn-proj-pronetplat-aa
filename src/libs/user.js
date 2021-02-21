import { store, updateStore } from 'fluxible-js';
import React from 'react';
import { Paragraph, Text } from 'react-native-paper';
import UserAvatar from 'components/UserAvatar';
import { toast, updateOrCreateToast } from 'fluxible/actions/popup';
import { xhr } from 'libs/xhr';

export function getFullName ({ firstName, middleName, surname }) {
  let fullName = '';

  if (firstName) fullName += `${firstName} `;
  if (middleName) fullName += `${middleName} `;
  fullName += surname;

  return fullName;
}

export function getInitials ({ firstName, middleName, surname }) {
  return (
    (firstName?.[0] || '') +
    (middleName?.[0] || '') +
    (surname?.[0] || '')
  ).toUpperCase();
}

export function renderUserTitle (
  { jobTitle, company },
  { numberOfLines = 2, style } = {}
) {
  return (
    <Paragraph numberOfLines={numberOfLines}>
      <Text style={[{ fontWeight: 'bold' }, style]}>{jobTitle}</Text>
      {company ? (
        <>
          <Text> at </Text>
          <Text style={[{ fontWeight: 'bold' }, style]}>
            {company}
          </Text>
        </>
      ) : null}
    </Paragraph>
  );
}

function setSendingContactRequestStatus ({ targetId, status }) {
  updateStore({
    sendingContactRequests: store.sendingContactRequests.map(
      contact => {
        if (contact.id !== targetId) return contact;

        return {
          ...contact,
          status
        };
      }
    )
  });
}

export function sendContactRequest (targetUser) {
  try {
    if (
      !targetUser.id ||
      !targetUser.firstName ||
      !targetUser.surname ||
      !targetUser.jobTitle ||
      !targetUser.gender ||
      !targetUser.profilePicture
    )
      throw new Error('Invalid target user data');

    if (targetUser.id === store.authUser.id)
      throw new Error('Cannot send request to self.');

    const pendingContactRequest = store.sendingContactRequests.find(
      ({ id }) => targetUser.id === id
    );

    if (pendingContactRequest) {
      if (pendingContactRequest.status === 'error')
        addToContact(pendingContactRequest);
      return;
    }

    updateStore({
      sendingContactRequests: store.sendingContactRequests.concat({
        ...targetUser,
        status: 'initial'
      })
    });
  } catch (error) {
    console.log(error);
  }
}

export async function addToContact (targetContact) {
  const { id: targetId, status } = targetContact;

  if (status === 'sending') return;

  const fullName = getFullName(targetContact);
  const icon = <UserAvatar size={35} user={targetContact} />;

  const toastId = toast({
    message: `Sending contact request to ${fullName}`,
    icon
  });

  try {
    setSendingContactRequestStatus({ targetId, status: 'sending' });

    await xhr('/add-to-contacts', {
      method: 'post',
      body: { contactId: targetId }
    });

    updateOrCreateToast({
      id: toastId,
      message: `Successfully sent contact request to ${fullName}`,
      icon,
      type: 'success'
    });

    setSendingContactRequestStatus({ targetId, status: 'success' });
  } catch (error) {
    console.log('error', error);

    if (error.status === 422) {
      updateOrCreateToast({
        id: toastId,
        message: `There's an existing contact request with ${fullName}.`,
        icon,
        type: 'error'
      });

      setSendingContactRequestStatus({
        targetId,
        status: 'success'
      });
    } else {
      setSendingContactRequestStatus({ targetId, status: 'error' });

      updateOrCreateToast({
        id: toastId,
        message: `Failed to send contact request to ${fullName}`,
        icon,
        type: 'error'
      });
    }
  }
}

export function getPersonalPronoun (userData) {
  if (userData.gender === 'male') {
    return {
      subjective: {
        ucfirst: 'He',
        lowercase: 'he'
      },
      objective: {
        ucfirst: 'Him',
        lowercase: 'him'
      },
      possessive: {
        ucfirst: 'His',
        lowercase: 'his'
      }
    };
  }

  return {
    subjective: {
      ucfirst: 'She',
      lowercase: 'she'
    },
    objective: {
      ucfirst: 'Her',
      lowercase: 'her'
    },
    possessive: {
      ucfirst: 'Her',
      lowercase: 'her'
    }
  };
}

export function hasCompletedSetup (user) {
  return (
    user.firstName &&
    user.surname &&
    user.gender &&
    user.jobTitle &&
    user.profilePicture
  );
}
