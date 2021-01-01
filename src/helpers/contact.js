import { store, updateStore } from 'fluxible-js';
import React from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import Toast from 'react-native-simple-toast';
import { xhr } from 'libs/xhr';

export function getFullName ({ firstName, middleName, surname }) {
  return `${firstName}${middleName ? ` ${middleName} ` : ' '}${surname}`;
}

export function renderContactTitle ({ jobTitle, company }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Text style={{ fontWeight: 'bold' }}>{jobTitle}</Text>
      {company ? (
        <>
          <Text> at </Text>
          <Text style={{ fontWeight: 'bold' }}>{company}</Text>
        </>
      ) : null}
    </View>
  );
}

function setPendingContactRequestStatus ({ targetId, status }) {
  updateStore({
    pendingContactRequests: store.pendingContactRequests.map(contact => {
      if (contact.id !== targetId) return contact;

      return {
        ...contact,
        status
      };
    })
  });
}

export async function addToContact (targetContact) {
  const { id: targetId, status } = targetContact;
  const fullName = getFullName(targetContact);

  if (status === 'sending') return;

  try {
    Toast.show(`Sending contact request to ${fullName}`);
    setPendingContactRequestStatus({ targetId, status: 'sending' });
    await xhr(`/add-to-contacts/${targetId}`, { method: 'post' });
    Toast.show(`Successfully sent contact request to ${fullName}`);
    setPendingContactRequestStatus({ targetId, status: 'success' });
  } catch (error) {
    console.log('error', error);
    setPendingContactRequestStatus({ targetId, status: 'error' });
    Toast.show(`Failed to send contact request to ${fullName}`);
  }
}
