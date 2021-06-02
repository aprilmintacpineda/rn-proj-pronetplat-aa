import { store, updateStore } from 'fluxible-js';
import React from 'react';
import RefreshController from './RefreshController';
import Row from './Row';
import { navigationRef } from 'App';
import ContactsLoadingPlaceholder from 'components/ContactsLoadingPlaceholder';
import DataFlatList from 'components/DataFlatList';

const eventListeners = {
  refreshMyContactList: () => {
    if (!store.refreshMyContactList)
      updateStore({ refreshMyContactList: true });
  },
  'websocketEvent-chatMessageReceived': (
    { user },
    { replaceData }
  ) => {
    const currentRoute = navigationRef.current.getCurrentRoute();

    if (
      currentRoute.name === 'ContactChat' &&
      currentRoute.params.id === user.id
    )
      return;

    replaceData(data =>
      data.map(contact => {
        if (contact.id !== user.id) return contact;

        return {
          ...contact,
          unreadChatMessages: contact.unreadChatMessages + 1
        };
      })
    );
  },
  resetUnreadChatMessages: (userId, { replaceData }) => {
    replaceData(data =>
      data.map(contact => {
        if (contact.id !== userId) return contact;

        return {
          ...contact,
          unreadChatMessages: 0
        };
      })
    );
  }
};

function ContactList () {
  return (
    <DataFlatList
      LoadingPlaceHolder={ContactsLoadingPlaceholder}
      endpoint="/my-contacts"
      eventListeners={eventListeners}
      RowComponent={Row}
      listEmptyMessage="You have no contacts yet."
    >
      <RefreshController />
    </DataFlatList>
  );
}

export default React.memo(ContactList);
