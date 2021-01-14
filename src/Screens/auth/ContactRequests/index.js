import React from 'react';
import RowComponent from './Row';
import ContactsLoadingPlaceholder from 'components/ContactsLoadingPlaceholder';
import DataFlatList from 'components/DataFlatList';
import ListEmpty from 'components/ListEmpty';

function ContactRequests () {
  return (
    <DataFlatList
      endpoint="/received-contact-requests"
      ListEmptyComponent={ListEmpty}
      RowComponent={RowComponent}
      LoadingPlaceHolder={ContactsLoadingPlaceholder}
    />
  );
}

export default React.memo(ContactRequests);
