import React from 'react';

import ContactListEmpty from './Empty';
import LoadingPlaceHolder from './LoadingPlaceHolder';
import ContactListRow from './Row';
import DataFlatList from 'components/DataFlatList';

function ContactList () {
  return (
    <DataFlatList
      endpoint="/contacts"
      ListEmptyComponent={ContactListEmpty}
      RowComponent={ContactListRow}
      LoadingPlaceHolder={LoadingPlaceHolder}
    />
  );
}

export default React.memo(ContactList);
