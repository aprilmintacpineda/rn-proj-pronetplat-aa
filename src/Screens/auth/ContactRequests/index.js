import React from 'react';
import ReceivedRow from './ReceivedRow';
import SentRow from './SentRow';
import ContactsLoadingPlaceholder from 'components/ContactsLoadingPlaceholder';
import DataFlatList from 'components/DataFlatList';
import Tabs from 'components/Tabs';
import Tab from 'components/Tabs/Tab';

const receivedEventListeners = {
  respondedToContactRequest: (senderId, { filterData }) => {
    filterData(data => data.senderId !== senderId);
  }
};

const sentEventListeners = {
  cancelledContactRequest: (recipientId, { filterData }) => {
    filterData(data => data.recipientId !== recipientId);
  },
  sentFollowUp: (newData, { updateData }) => {
    updateData(data => {
      if (data.recipientId !== newData.recipientId) return data;

      return {
        ...data,
        ...newData
      };
    });
  }
};

function ContactRequests () {
  return (
    <Tabs>
      <Tab label="Received">
        <DataFlatList
          endpoint="/received-contact-requests"
          RowComponent={ReceivedRow}
          LoadingPlaceHolder={ContactsLoadingPlaceholder}
          eventListeners={receivedEventListeners}
          listEmptyMessage="You haven't received any contact request yet."
        />
      </Tab>
      <Tab label="Sent">
        <DataFlatList
          endpoint="/sent-contact-requests"
          RowComponent={SentRow}
          LoadingPlaceHolder={ContactsLoadingPlaceholder}
          eventListeners={sentEventListeners}
          listEmptyMessage="You haven't sent any contact request yet."
        />
      </Tab>
    </Tabs>
  );
}

export default React.memo(ContactRequests);
