import { store, updateStore } from 'fluxible-js';
import React from 'react';
import ReceivedRow from './ReceivedRow';
import SentRow from './SentRow';
import ContactsLoadingPlaceholder from 'components/ContactsLoadingPlaceholder';
import DataFlatList from 'components/DataFlatList';
import Tabs from 'components/Tabs';
import Tab from 'components/Tabs/Tab';

const receivedEventListeners = {
  respondedToEventInvitation: (eventId, { data, replaceData }) => {
    let removedData = 0;

    const newData = data.filter(invitation => {
      const shouldKeep = invitation.event.id !== eventId;
      if (!shouldKeep) removedData++;
      return shouldKeep;
    });

    replaceData(newData);

    updateStore({
      authUser: {
        ...store.authUser,
        eventInvitationsCount: Math.max(
          store.authUser.eventInvitationsCount - removedData,
          0
        )
      }
    });
  },
  'websocketEvent-eventInvitationCancelled': (
    { sender, payload: { event } },
    { replaceData }
  ) => {
    replaceData(data =>
      data.filter(
        invitation =>
          invitation.event.id !== event.id &&
          sender.id !== invitation.inviter.id
      )
    );
  },
  'websocketEvent-eventInvitation': (_, { refreshData }) => {
    refreshData();
  }
};

const sentEventListeners = {
  cancelledInvitation: (invitationId, { replaceData }) => {
    replaceData(data =>
      data.filter(invitation => invitation.id !== invitationId)
    );
  },
  'websocketEvent-eventInvitationRejected': (
    { payload: { eventInvitation } },
    { replaceData }
  ) => {
    replaceData(data =>
      data.filter(invitation => invitation.id !== eventInvitation.id)
    );
  },
  'websocketEvent-eventInvitationAccepted': (
    { payload: { eventInvitation } },
    { replaceData }
  ) => {
    replaceData(data =>
      data.filter(invitation => invitation.id !== eventInvitation.id)
    );
  }
};

function resetEventInvitationsCount (data) {
  const { eventInvitationsCount } = store.authUser;
  if (!eventInvitationsCount) return;

  const len = data.length;

  updateStore({
    authUser: {
      ...store.authUser,
      eventInvitationsCount:
        len < 20 && eventInvitationsCount > len
          ? len
          : eventInvitationsCount
    }
  });
}

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
          onSuccess={resetEventInvitationsCount}
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
