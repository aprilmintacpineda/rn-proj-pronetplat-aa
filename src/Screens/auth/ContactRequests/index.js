import React from 'react';
import RowComponent from './Row';
import ContactsLoadingPlaceholder from 'components/ContactsLoadingPlaceholder';
import DataFlatList from 'components/DataFlatList';

const eventListeners = {
  respondedToContactRequest: (contactId, { filterData }) => {
    filterData(data => data.senderId !== contactId);
  }
};

function ContactRequests () {
  return (
    <DataFlatList
      endpoint="/received-contact-requests"
      RowComponent={RowComponent}
      LoadingPlaceHolder={ContactsLoadingPlaceholder}
      eventListeners={eventListeners}
    />
  );
}

export default React.memo(ContactRequests);
