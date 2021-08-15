import { store, updateStore } from 'fluxible-js';
import React from 'react';
import RefreshController from './RefreshController';
import Row from './Row';
import ContactsLoadingPlaceholder from 'components/ContactsLoadingPlaceholder';
import DataFlatList from 'components/DataFlatList';

const eventListeners = {
  refreshContactList: () => {
    if (!store.screensToRefresh.includes('ContactList')) {
      updateStore({
        screensToRefresh:
          store.screensToRefresh.concat('ContactList')
      });
    }
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
