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

export function renderContactTitle ({ jobTitle, company }, style) {
  return (
    <Paragraph style={style}>
      <Text style={{ fontWeight: 'bold' }}>{jobTitle}</Text>
      {company ? (
        <>
          <Text> at </Text>
          <Text style={{ fontWeight: 'bold' }}>{company}</Text>
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

export function sendContactRequest (targetUser, onDone = null) {
  try {
    if (
      !targetUser.id ||
      !targetUser.firstName ||
      !targetUser.surname ||
      !targetUser.jobTitle
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
        status: 'initial',
        onDone
      })
    });
  } catch (error) {
    console.log(error);
  }
}

export async function addToContact (targetContact) {
  const { id: targetId, status, onDone } = targetContact;
  const fullName = getFullName(targetContact);
  const icon = <UserAvatar size={35} user={targetContact} />;

  if (status === 'sending') return;

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

    if (onDone) onDone();
  } catch (error) {
    console.log('error', error);

    if (error.status === 422) {
      const status = await error.text();

      updateOrCreateToast({
        id: toastId,
        message:
          status === 'pendingSentRequest'
            ? `Already sent a contact request to ${fullName}`
            : `${fullName} has already sent you a contact request.`,
        icon,
        type: 'error'
      });

      setSendingContactRequestStatus({
        targetId,
        status: 'success'
      });

      console.log(onDone);

      if (onDone) onDone();
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
