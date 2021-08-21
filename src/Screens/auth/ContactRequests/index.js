import React from 'react';
import ReceivedRow from './ReceivedRow';
import SentRow from './SentRow';
import ContactsLoadingPlaceholder from 'components/ContactsLoadingPlaceholder';
import DataFlatList from 'components/DataFlatList';
import Tabs from 'components/Tabs';
import Tab from 'components/Tabs/Tab';
import { refreshScreen } from 'fluxible/actions/screensToRefresh';

const receivedEventListeners = {
  respondedToContactRequest: (senderId, { replaceData }) => {
    replaceData(data =>
      data.filter(
        concatRequest => concatRequest.senderId !== senderId
      )
    );
  }
};

const sentEventListeners = {
  cancelledContactRequest: (recipientId, { replaceData }) => {
    replaceData(data =>
      data.filter(
        contactRequest => contactRequest.recipientId !== recipientId
      )
    );
  },
  'websocketEvent-contactRequestAccepted': (
    { sender },
    { replaceData }
  ) => {
    replaceData(data =>
      data.filter(
        contactRequest => contactRequest.recipientId !== sender.id
      )
    );

    refreshScreen('ContactList');
  },
  sentFollowUp: (updatedContactRequest, { replaceData }) => {
    replaceData(data =>
      data.map(contactRequest => {
        if (
          contactRequest.recipientId !==
          updatedContactRequest.recipientId
        )
          return contactRequest;

        return {
          ...contactRequest,
          ...updatedContactRequest
        };
      })
    );
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
