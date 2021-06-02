import { emitEvent } from 'fluxible-js';
import React from 'react';
import { Platform, View } from 'react-native';
import { Text } from 'react-native-paper';
import MessageInput from './MessageInput';
import Row from './Row';
import { navigationRef } from 'App';
import Avatar from 'components/Avatar';
import DataFlatList from 'components/DataFlatList';
import { getFullName } from 'libs/user';
import { xhr } from 'libs/xhr';

const eventListeners = {
  'websocketEvent-chatMessageSeen': (
    { user, payload: { seenAt, unseenChatMessageIds } },
    { replaceData }
  ) => {
    const currentRoute = navigationRef.current.getCurrentRoute();
    if (currentRoute.params.id !== user.id) return;

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
    { user, payload },
    { replaceData }
  ) => {
    const currentRoute = navigationRef.current.getCurrentRoute();
    if (currentRoute.params.id !== user.id) return;

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
  }
};

function ContactChat ({
  navigation: { setOptions },
  route: { params: contact }
}) {
  React.useEffect(() => {
    setOptions({
      appbarContentStyle: {
        alignItems: 'flex-start',
        right: 20
      },
      appbarContent: (
        <View
          style={{
            marginLeft: 15,
            flexDirection: 'row',
            alignItems: 'center'
          }}
        >
          <Avatar size={40} uri={contact.profilePicture} />
          <Text
            style={{
              marginLeft: 10,
              color: '#fff',
              fontSize: Platform.select({
                ios: 17,
                android: 20
              }),
              flex: 1
            }}
            numberOfLines={1}
          >
            {getFullName(contact)}
          </Text>
        </View>
      )
    });

    emitEvent('resetUnreadChatMessages', contact.id);
  }, [setOptions, contact]);

  return (
    <View style={{ flex: 1 }}>
      <DataFlatList
        disableRefresh
        inverted
        ItemSeparatorComponent={null}
        endpoint={`/chat-messages/${contact.id}`}
        RowComponent={Row}
        listEmptyMessage="No chat messages yet."
        eventListeners={eventListeners}
      />
      <MessageInput />
    </View>
  );
}

export default React.memo(ContactChat);
