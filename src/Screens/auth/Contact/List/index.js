import { store, updateStore } from 'fluxible-js';
import React from 'react';
import RefreshController from './RefreshController';
import Row from './Row';
import ContactsLoadingPlaceholder from 'components/ContactsLoadingPlaceholder';
import DataFlatList from 'components/DataFlatList';

const eventListeners = {
  refreshMyContactList: () => {
    if (!store.refreshMyContactList)
      updateStore({ refreshMyContactList: true });
  }
};

function ContactList () {
  return (
    <DataFlatList
      LoadingPlaceHolder={ContactsLoadingPlaceholder}
      endpoint="/my-contacts"
      eventListeners={eventListeners}
      RowComponent={Row}
    >
      <RefreshController />
    </DataFlatList>
  );
}

export default React.memo(ContactList);
