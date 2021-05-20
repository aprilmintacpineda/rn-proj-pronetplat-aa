import React from 'react';
import Row from './Row';
import ContactsLoadingPlaceholder from 'components/ContactsLoadingPlaceholder';
import DataFlatList from 'components/DataFlatList';

const eventListeners = {
  userUnblocked: (contactId, { replaceData }) => {
    replaceData(data =>
      data.filter(contact => contact.id !== contactId)
    );
  }
};

function BlockList () {
  return (
    <DataFlatList
      endpoint="/block-list"
      eventListeners={eventListeners}
      RowComponent={Row}
      LoadingPlaceHolder={ContactsLoadingPlaceholder}
      listEmptyMessage="No blocked users."
    />
  );
}

export default React.memo(BlockList);
