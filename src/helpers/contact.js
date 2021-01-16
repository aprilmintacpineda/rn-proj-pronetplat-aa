import { store, updateStore } from 'fluxible-js';
import React from 'react';
import { Paragraph, Text } from 'react-native-paper';
import Avatar from 'components/Avatar';
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

function setPendingContactRequestStatus ({ targetId, status }) {
  updateStore({
    pendingContactRequests: store.pendingContactRequests.map(
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

export async function addToContact (targetContact) {
  const { id: targetId, status, profilePicture } = targetContact;
  const fullName = getFullName(targetContact);
  const avatarLabel = getInitials(targetContact);
  const icon = (
    <Avatar size={35} uri={profilePicture} label={avatarLabel} />
  );

  if (status === 'sending') return;

  const toastId = toast({
    message: `Sending contact request to ${fullName}`,
    icon
  });

  try {
    setPendingContactRequestStatus({ targetId, status: 'sending' });
    await xhr(`/add-to-contacts/${targetId}`, { method: 'post' });

    updateOrCreateToast({
      id: toastId,
      message: `Successfully sent contact request to ${fullName}`,
      icon,
      type: 'success'
    });

    setPendingContactRequestStatus({ targetId, status: 'success' });
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

      setPendingContactRequestStatus({
        targetId,
        status: 'success'
      });
    } else {
      setPendingContactRequestStatus({ targetId, status: 'error' });

      updateOrCreateToast({
        id: toastId,
        message: `Failed to send contact request to ${fullName}`,
        icon,
        type: 'error'
      });
    }
  }
}
