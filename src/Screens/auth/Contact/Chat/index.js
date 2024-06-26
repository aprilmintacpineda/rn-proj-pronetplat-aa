import { emitEvent } from 'fluxible-js';
import React from 'react';
import { View } from 'react-native';
import MessageInput from './MessageInput';
import Row from './Row';
import { navigationRef } from 'App';
import DataFlatList from 'components/DataFlatList';
import { xhr } from 'libs/xhr';

const eventListeners = {
  'websocketEvent-chatMessageSeen': (
    { sender, payload: { seenAt, unseenChatMessageIds } },
    { replaceData }
  ) => {
    const currentRoute = navigationRef.current.getCurrentRoute();
    if (currentRoute.params.id !== sender.id) return;

    replaceData(data =>
      data.map(chatMessage => {
        if (unseenChatMessageIds.includes(chatMessage.id)) {
          return {
            ...chatMessage,
            seenAt
          };
        }

        return chatMessage;
      })
    );
  },
  'websocketEvent-chatMessageReceived': async (
    { sender, payload },
    { replaceData }
  ) => {
    const currentRoute = navigationRef.current.getCurrentRoute();
    if (currentRoute.params.id !== sender.id) return;

    replaceData(data => [payload].concat(data));

    try {
      await xhr(`/chat-message-seen/${payload.id}`, {
        method: 'post'
      });
    } catch (error) {
      console.log(error);
    }
  },
  chatMessageSending: (chatMessage, { replaceData }) => {
    replaceData(data => [chatMessage].concat(data));
  },
  chatMessageSendSuccess: (
    { tempId, sentChatMessage },
    { replaceData }
  ) => {
    replaceData(data =>
      data.map(chatMessage => {
        if (chatMessage.id !== tempId) return chatMessage;
        return sentChatMessage;
      })
    );
  },
  cancelSend: (tempId, { replaceData }) => {
    replaceData(data =>
      data.filter(chatMessage => chatMessage.id !== tempId)
    );
  }
};

function ContactChat ({ route: { params: contact } }) {
  React.useEffect(() => {
    emitEvent('resetUnreadChatMessages', contact.id);
  }, [contact]);

  return (
    <View style={{ flex: 1, flexDirection: 'column-reverse' }}>
      <DataFlatList
        disableRefresh
        inverted
        ItemSeparatorComponent={null}
        endpoint={`/chat-messages/${contact.id}`}
        RowComponent={Row}
        listEmptyMessage="No chat messages yet."
        eventListeners={eventListeners}
      >
        <MessageInput />
      </DataFlatList>
    </View>
  );
}

export default React.memo(ContactChat);
