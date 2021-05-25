import { useRoute } from '@react-navigation/core';
import { addEvent, emitEvent } from 'fluxible-js';
import React from 'react';
import { TextInput, View } from 'react-native';
import Caption from 'components/Caption';
import IconButton from 'components/IconButton';
import RNVectorIcon from 'components/RNVectorIcon';
import { getFullName } from 'libs/user';
import { xhr } from 'libs/xhr';

function SendIcon () {
  return (
    <RNVectorIcon
      provider="Ionicons"
      name="ios-arrow-undo-outline"
      color="#fff"
      size={30}
    />
  );
}

function ChatMessageInput () {
  const { params: contact } = useRoute();
  const [messageBody, setMessageBody] = React.useState('');
  const [isTyping, setIsTyping] = React.useState(false);
  const shouldCallTypingStatus = React.useRef(true);
  const isTypingTimeout = React.useRef(null);

  const send = React.useCallback(async () => {
    if (!messageBody) return;

    setMessageBody('');

    emitEvent('chatMessageSending', {
      id: `${Math.random()}-${Math.random()}`,
      recipientId: contact.id,
      messageBody,
      toSend: true
    });

    try {
      shouldCallTypingStatus.current = true;

      await xhr(`/chat-typing-status/${contact.id}`, {
        method: 'post',
        body: {
          isTyping: false
        }
      });
    } catch (error) {
      console.log(error);
    }
  }, [messageBody, contact]);

  React.useEffect(() => {
    const removeEventListener = addEvent(
      'websocketEvent-typingStatus',
      ({ user, payload: { isTyping } }) => {
        if (user.id === contact.id) setIsTyping(isTyping);
      }
    );

    return removeEventListener;
  }, [contact]);

  const onChangeText = React.useCallback(
    async value => {
      setMessageBody(value);

      clearTimeout(isTypingTimeout.current);

      if (shouldCallTypingStatus.current) {
        shouldCallTypingStatus.current = false;

        await xhr(`/chat-typing-status/${contact.id}`, {
          method: 'post',
          body: {
            isTyping: true
          }
        });
      }

      isTypingTimeout.current = setTimeout(async () => {
        shouldCallTypingStatus.current = true;

        await xhr(`/chat-typing-status/${contact.id}`, {
          method: 'post',
          body: {
            isTyping: false
          }
        });
      }, 5000);
    },
    [contact]
  );

  return (
    <View>
      {isTyping ? (
        <Caption
          style={{
            marginLeft: 10,
            marginBottom: 5,
            fontStyle: 'italic'
          }}
        >
          {getFullName(contact)} is typing...
        </Caption>
      ) : null}
      <View
        style={{
          borderTopWidth: 1,
          borderTopColor: '#d0d1d5',
          flexDirection: 'row',
          padding: 15,
          alignItems: 'center'
        }}
      >
        <View style={{ flex: 1, marginRight: 15 }}>
          <TextInput
            value={messageBody}
            onChangeText={onChangeText}
            multiline
            placeholder="Send a message"
          />
        </View>
        <View style={{ alignSelf: 'flex-end' }}>
          <IconButton
            onPress={send}
            icon={SendIcon}
            disabled={!messageBody}
          />
        </View>
      </View>
    </View>
  );
}

export default React.memo(ChatMessageInput);
