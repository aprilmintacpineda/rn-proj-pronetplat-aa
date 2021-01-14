import { store, updateStore } from 'fluxible-js';
import React from 'react';
import RowComponent from './Row';
import ContactsLoadingPlaceholder from 'components/ContactsLoadingPlaceholder';
import DataFlatList from 'components/DataFlatList';
import ListEmpty from 'components/ListEmpty';

function resetNotificationsCount () {
  if (store.notificationsCount)
    updateStore({ notificationsCount: 0 });
}

function Notifications () {
  return (
    <DataFlatList
      endpoint="/notifications"
      ListEmptyComponent={ListEmpty}
      RowComponent={RowComponent}
      LoadingPlaceHolder={ContactsLoadingPlaceholder}
      onSuccess={resetNotificationsCount}
    />
  );
}

export default React.memo(Notifications);
