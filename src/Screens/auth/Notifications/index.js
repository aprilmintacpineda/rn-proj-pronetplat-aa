import React from 'react';
import RowComponent from './Row';
import ContactsLoadingPlaceholder from 'components/ContactsLoadingPlaceholder';
import DataFlatList from 'components/DataFlatList';
import ListEmpty from 'components/ListEmpty';
import { resetNotificationsCount } from 'fluxible/actions/user';

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
