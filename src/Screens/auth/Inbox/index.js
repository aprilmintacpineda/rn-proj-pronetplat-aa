import { store, updateStore } from 'fluxible-js';
import React from 'react';
import RefreshController from './RefreshController';
import Row from './Row';
import ContactsLoadingPlaceholder from 'components/ContactsLoadingPlaceholder';
import DataFlatList from 'components/DataFlatList';

const eventListeners = {
  'websocketEvent-chatMessageSeen': (
    { user, payload: { seenAt, unseenChatMessageIds } },
    { replaceData }
  ) => {
    replaceData(data =>
      data.map(inbox => {
        if (
          inbox.contactId !== user.id ||
          !unseenChatMessageIds.includes(inbox.lastMessageId)
        )
          return inbox;

        return {
          ...inbox,
          numUnreadChatMessages: inbox.numUnreadChatMessages
            ? inbox.numUnreadChatMessages - 1
            : inbox.numUnreadChatMessages,
          lastMessage: {
            ...inbox.lastMessage,
            seenAt
          }
        };
      })
    );
  },
  'websocketEvent-chatMessageReceived': (
    { user, payload },
    { replaceData }
  ) => {
    updateStore({
      authUser: {
        ...store.authUser,
        unreadChatMessagesCount:
          store.authUser.unreadChatMessagesCount + 1
      }
    });

    replaceData(data => {
      const newData = [].concat(data);
      const index = newData.findIndex(
        inbox => inbox.contactId === user.id
      );

      if (index === -1) {
        return [
          {
            contactId: user.id,
            contact: user,
            lastMessageId: payload.id,
            lastMessage: payload,
            numUnreadChatMessages: 1
          }
        ].concat(data);
      }

      const inbox = newData.splice(index, 1)[0];

      return [
        {
          ...inbox,
          lastMessageId: payload.id,
          lastMessage: payload,
          numUnreadChatMessages: inbox.numUnreadChatMessages + 1
        }
      ].concat(newData);
    });
  },
  chatMessageSendSuccess: (
    { sentChatMessage, contact },
    { replaceData }
  ) => {
    replaceData(data => {
      const newData = [].concat(data);
      const index = newData.findIndex(
        inbox => inbox.contactId === contact.id
      );

      if (index === -1) {
        return [
          {
            contactId: contact.id,
            contact,
            lastMessageId: sentChatMessage.id,
            lastMessage: sentChatMessage,
            numUnreadChatMessages: 1
          }
        ].concat(data);
      }

      const inbox = newData.splice(index, 1)[0];

      return [
        {
          ...inbox,
          lastMessageId: sentChatMessage.id,
          lastMessage: sentChatMessage
        }
      ].concat(newData);
    });
  },
  resetUnreadChatMessages: (userId, { data, replaceData }) => {
    const inbox = data.find(inbox => inbox.contactId === userId);

    updateStore({
      authUser: {
        ...store.authUser,
        unreadChatMessagesCount: store.authUser
          .unreadChatMessagesCount
          ? store.authUser.unreadChatMessagesCount -
            inbox.numUnreadChatMessages
          : store.authUser.unreadChatMessagesCount
      }
    });

    replaceData(data =>
      data.map(inbox => {
        if (inbox.contactId !== userId) return inbox;

        return {
          ...inbox,
          numUnreadChatMessages: 0
        };
      })
    );
  },
  'websocketEvent-typingStatus': (
    { user, payload: { isTyping } },
    { data, replaceData }
  ) => {
    if (data.find(inbox => inbox.contactId === user.id)) {
      replaceData(data =>
        data.map(inbox => {
          if (inbox.contactId !== user.id) return inbox;

          return {
            ...inbox,
            isTyping
          };
        })
      );
    }
  }
};

function Inbox () {
  return (
    <DataFlatList
      LoadingPlaceHolder={ContactsLoadingPlaceholder}
      endpoint="/my-inbox"
      eventListeners={eventListeners}
      RowComponent={Row}
      listEmptyMessage="You have no chat messages yet."
    >
      <RefreshController />
    </DataFlatList>
  );
}

export default React.memo(Inbox);
