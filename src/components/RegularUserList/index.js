import React from 'react';
import RowComponent from './Row';
import ContactsLoadingPlaceholder from 'components/ContactsLoadingPlaceholder';
import DataFlatList from 'components/DataFlatList';

function RegularUserList (dataFlatListProps) {
  return (
    <DataFlatList
      RowComponent={RowComponent}
      LoadingPlaceHolder={ContactsLoadingPlaceholder}
      {...dataFlatListProps}
    />
  );
}

export default React.memo(RegularUserList);
