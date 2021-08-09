import React from 'react';
import ReceivedRow from './ReceivedRow';
import SentRow from './SentRow';
import ContactsLoadingPlaceholder from 'components/ContactsLoadingPlaceholder';
import DataFlatList from 'components/DataFlatList';
import Tabs from 'components/Tabs';
import Tab from 'components/Tabs/Tab';

const receivedEventListeners = {
  respondedToEventInvitation: (invitationId, { replaceData }) => {
    replaceData(data =>
      data.filter(invitation => invitation.id !== invitationId)
    );
  }
};

const sentEventListeners = {};

function EventInvitations () {
  return (
    <Tabs>
      <Tab label="Received">
        <DataFlatList
          endpoint="/received-event-invitations"
          RowComponent={ReceivedRow}
          LoadingPlaceHolder={ContactsLoadingPlaceholder}
          eventListeners={receivedEventListeners}
          listEmptyMessage="You haven't received event invitations yet."
        />
      </Tab>
      <Tab label="Sent">
        <DataFlatList
          endpoint="/sent-event-invitations"
          RowComponent={SentRow}
          LoadingPlaceHolder={ContactsLoadingPlaceholder}
          eventListeners={sentEventListeners}
          listEmptyMessage="You haven't sent event invitations yet."
        />
      </Tab>
    </Tabs>
  );
}

export default React.memo(EventInvitations);
