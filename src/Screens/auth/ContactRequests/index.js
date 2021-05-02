import React from 'react';
import RowComponent from './Row';
import ContactsLoadingPlaceholder from 'components/ContactsLoadingPlaceholder';
import DataFlatList from 'components/DataFlatList';

const eventListeners = {
  respondedToContactRequest: (senderId, { filterData }) => {
    filterData(data => data.senderId !== senderId);
  }
};

function ContactRequests () {
  return (
    <DataFlatList
      endpoint="/received-contact-requests"
      RowComponent={RowComponent}
      LoadingPlaceHolder={ContactsLoadingPlaceholder}
      eventListeners={eventListeners}
      listEmptyMessage="You haven't received any contact request yet."
    />
  );
}

export default React.memo(ContactRequests);
