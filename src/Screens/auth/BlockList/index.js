import React from 'react';
import Row from './Row';
import ContactsLoadingPlaceholder from 'components/ContactsLoadingPlaceholder';
import DataFlatList from 'components/DataFlatList';

const eventListeners = {
  userUnblocked: (contactId, { filterData }) => {
    filterData(data => data.id !== contactId);
  }
};

function BlockList () {
  return (
    <DataFlatList
      endpoint="/block-list"
      eventListeners={eventListeners}
      RowComponent={Row}
      LoadingPlaceHolder={ContactsLoadingPlaceholder}
    />
  );
}

export default React.memo(BlockList);
