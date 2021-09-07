import React from 'react';
import RefreshController from './RefreshController';
import Row from './Row';
import ContactsLoadingPlaceholder from 'components/ContactsLoadingPlaceholder';
import DataFlatList from 'components/DataFlatList';
import { refreshScreen } from 'fluxible/actions/screensToRefresh';

const eventListeners = {
  refreshContactList: () => {
    refreshScreen('ContactList');
  },
  'websocketEvent-contactRequestAccepted': () => {
    refreshScreen('ContactList');
  },
  'websocketEvent-userDisconnected': (
    { sender },
    { replaceData }
  ) => {
    replaceData(data =>
      data.filter(contact => contact.id !== sender.id)
    );
  },
  'websocketEvent-blockedByUser': ({ sender }, { replaceData }) => {
    replaceData(data =>
      data.filter(contact => contact.id !== sender.id)
    );
  },
  blockedUser: (contactId, { replaceData }) => {
    replaceData(data =>
      data.filter(contact => contact.id !== contactId)
    );
  },
  userDisconnected: (contactId, { replaceData }) => {
    replaceData(data =>
      data.filter(contact => contact.id !== contactId)
    );
  }
};

function ContactList () {
  return (
    <DataFlatList
      LoadingPlaceHolder={ContactsLoadingPlaceholder}
      endpoint="/search-contacts"
      eventListeners={eventListeners}
      RowComponent={Row}
      listEmptyMessage="You have no contacts yet."
    >
      <RefreshController />
    </DataFlatList>
  );
}

export default React.memo(ContactList);
