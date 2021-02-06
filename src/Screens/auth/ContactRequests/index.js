import React from 'react';
import RowComponent from './Row';
import ContactsLoadingPlaceholder from 'components/ContactsLoadingPlaceholder';
import DataFlatList from 'components/DataFlatList';
import ListEmpty from 'components/ListEmpty';

const events = {
  respondedToContactRequest: (contactId, { filterData }) => {
    filterData(data => data.senderId !== contactId);
  }
};

function ContactRequests () {
  return (
    <DataFlatList
      endpoint="/received-contact-requests"
      ListEmptyComponent={ListEmpty}
      RowComponent={RowComponent}
      LoadingPlaceHolder={ContactsLoadingPlaceholder}
      events={events}
    />
  );
}

export default React.memo(ContactRequests);
