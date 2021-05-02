import React from 'react';
import RowComponent from './Row';
import ContactsLoadingPlaceholder from 'components/ContactsLoadingPlaceholder';
import DataFlatList from 'components/DataFlatList';
import { resetNotificationsCount } from 'fluxible/actions/user';

function Notifications () {
  return (
    <DataFlatList
      endpoint="/notifications"
      RowComponent={RowComponent}
      LoadingPlaceHolder={ContactsLoadingPlaceholder}
      onSuccess={resetNotificationsCount}
      listEmptyMessage="You haven't received any notifications yet."
    />
  );
}

export default React.memo(Notifications);
