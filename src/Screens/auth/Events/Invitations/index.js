import React from 'react';
import ReceivedRow from './ReceivedRow';
import ContactsLoadingPlaceholder from 'components/ContactsLoadingPlaceholder';
import DataFlatList from 'components/DataFlatList';

const receivedEventListeners = {
  respondedToEventInvitation: (invitationId, { replaceData }) => {
    replaceData(data =>
      data.filter(invitation => invitation.id !== invitationId)
    );
  }
};

function EventInvitations () {
  return (
    <DataFlatList
      endpoint="/received-event-invitations"
      RowComponent={ReceivedRow}
      LoadingPlaceHolder={ContactsLoadingPlaceholder}
      eventListeners={receivedEventListeners}
      listEmptyMessage="You haven't received event invitations yet."
    />
  );
}

export default React.memo(EventInvitations);
