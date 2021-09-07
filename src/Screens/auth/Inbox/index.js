import { store, updateStore } from 'fluxible-js';
import React from 'react';
import RefreshController from './RefreshController';
import Row from './Row';
import ContactsLoadingPlaceholder from 'components/ContactsLoadingPlaceholder';
import DataFlatList from 'components/DataFlatList';

let typingStatusResetTimeout = null;

const eventListeners = {
  'websocketEvent-chatMessageSeen': (
    { sender, payload: { seenAt, unseenChatMessageIds } },
    { replaceData }
  ) => {
    replaceData(data =>
      data.map(inbox => {
        if (
          inbox.contactId !== sender.id ||
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
    { sender, payload },
    { replaceData }
  ) => {
    replaceData(data => {
      const newData = [].concat(data);
      const index = newData.findIndex(
        inbox => inbox.contactId === sender.id
      );

      if (index === -1) {
        return [
          {
            contactId: sender.id,
            contact: sender,
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
            numUnreadChatMessages: 0
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
    { sender, payload: { isTyping } },
    { data, replaceData }
  ) => {
    if (!data.find(inbox => inbox.contactId === sender.id)) return;

    clearTimeout(typingStatusResetTimeout);

    replaceData(data =>
      data.map(inbox => {
        if (inbox.contactId !== sender.id) return inbox;

        return {
          ...inbox,
          isTyping
        };
      })
    );

    if (isTyping) {
      typingStatusResetTimeout = setTimeout(() => {
        replaceData(data =>
          data.map(inbox => {
            if (inbox.contactId !== sender.id) return inbox;

            return {
              ...inbox,
              isTyping: false
            };
          })
        );
      }, 10000);
    }
  },
  'websocketEvent-userDisconnected': (
    { sender },
    { replaceData }
  ) => {
    replaceData(data =>
      data.map(inbox => {
        if (inbox.contactId !== sender.id) return inbox;

        return {
          ...inbox,
          contact: {
            ...inbox.contact,
            isConnected: false
          }
        };
      })
    );
  },
  'websocketEvent-contactRequestAccepted': (
    { sender },
    { replaceData }
  ) => {
    replaceData(data =>
      data.map(inbox => {
        if (inbox.contactId !== sender.id) return inbox;

        return {
          ...inbox,
          contact: {
            ...inbox.contact,
            isConnected: true
          }
        };
      })
    );
  },
  'websocketEvent-blockedByUser': ({ sender }, { replaceData }) => {
    replaceData(data =>
      data.map(inbox => {
        if (inbox.contactId !== sender.id) return inbox;

        return {
          ...inbox,
          contact: {
            ...inbox.contact,
            isConnected: false
          }
        };
      })
    );
  },
  contactRequestAccepted: (contactId, { replaceData }) => {
    replaceData(data =>
      data.map(inbox => {
        if (inbox.contactId !== contactId) return inbox;

        return {
          ...inbox,
          contact: {
            ...inbox.contact,
            isConnected: true
          }
        };
      })
    );
  },
  blockedUser: (contactId, { replaceData }) => {
    replaceData(data =>
      data.map(inbox => {
        if (inbox.contactId !== contactId) return inbox;

        return {
          ...inbox,
          contact: {
            ...inbox.contact,
            isConnected: false
          }
        };
      })
    );
  },
  userDisconnected: (contactId, { replaceData }) => {
    replaceData(data =>
      data.map(inbox => {
        if (inbox.contactId !== contactId) return inbox;

        return {
          ...inbox,
          contact: {
            ...inbox.contact,
            isConnected: false
          }
        };
      })
    );
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
