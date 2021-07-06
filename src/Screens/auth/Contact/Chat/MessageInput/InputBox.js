import { useRoute } from '@react-navigation/core';
import { addEvent, emitEvent } from 'fluxible-js';
import React from 'react';
import { TextInput, View } from 'react-native';
import { Text } from 'react-native-paper';
import Caption from 'components/Caption';
import IconButton from 'components/IconButton';
import RNVectorIcon from 'components/RNVectorIcon';
import useState from 'hooks/useState';
import { shortenName } from 'libs/user';
import { xhr } from 'libs/xhr';
import { paperTheme } from 'theme';

function SendIcon (props) {
  return (
    <RNVectorIcon
      provider="Ionicons"
      name="ios-arrow-undo-outline"
      {...props}
    />
  );
}

function ClearIcon (props) {
  return (
    <RNVectorIcon
      provider="Ionicons"
      name="ios-close-outline"
      {...props}
    />
  );
}

function ChatMessageInputBox () {
  const { params: contact } = useRoute();
  const {
    state: { replyTo, messageBody, isTyping },
    updateState
  } = useState({
    replyTo: null,
    messageBody: '',
    isTyping: false
  });
  const shouldCallTypingStatus = React.useRef(true);
  const isTypingTimeout = React.useRef(null);

  const send = React.useCallback(() => {
    if (!messageBody) return;

    emitEvent('chatMessageSending', {
      id: `${Math.random()}-${Math.random()}`,
      recipientId: contact.id,
      messageBody,
      replyTo,
      toSend: true
    });

    updateState({ messageBody: '', replyTo: null });
    clearTimeout(isTypingTimeout.current);
    shouldCallTypingStatus.current = true;

    xhr(`/chat-typing-status/${contact.id}`, {
      method: 'post',
      body: {
        isTyping: false
      }
    });
  }, [replyTo, messageBody, contact, updateState]);

  const clearReplyTo = React.useCallback(() => {
    updateState({ replyTo: null });
  }, [updateState]);

  React.useEffect(() => {
    const removeListeners = [
      addEvent(
        'websocketEvent-typingStatus',
        ({ user, payload: { isTyping } }) => {
          if (user.id === contact.id) updateState({ isTyping });
        }
      ),
      addEvent('replyToChatMessage', replyTo => {
        updateState({ replyTo });
      })
    ];

    return () => {
      removeListeners.forEach(removeListener => {
        removeListener();
      });
    };
  }, [contact, updateState]);

  const onChangeText = React.useCallback(
    value => {
      updateState({ messageBody: value });
      clearTimeout(isTypingTimeout.current);

      if (shouldCallTypingStatus.current) {
        shouldCallTypingStatus.current = false;

        xhr(`/chat-typing-status/${contact.id}`, {
          method: 'post',
          body: {
            isTyping: true
          }
        });
      }

      isTypingTimeout.current = setTimeout(() => {
        shouldCallTypingStatus.current = true;

        xhr(`/chat-typing-status/${contact.id}`, {
          method: 'post',
          body: {
            isTyping: false
          }
        });
      }, 5000);
    },
    [contact, updateState]
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
          {shortenName(contact.firstName)} is typing...
        </Caption>
      ) : null}
      <View
        style={{
          borderTopWidth: 1,
          borderTopColor: '#ededed'
        }}
      >
        {replyTo ? (
          <View
            style={{
              marginTop: 15,
              paddingHorizontal: 15,
              flexDirection: 'row',
              alignItems: 'flex-start'
            }}
          >
            <IconButton
              size={15}
              onPress={clearReplyTo}
              icon={ClearIcon}
            />
            <View style={{ marginLeft: 10, marginRight: 25 }}>
              <Caption>
                Replying to{' '}
                {replyTo.senderId === contact.id
                  ? shortenName(contact.firstName)
                  : 'yourself'}
              </Caption>
              <Text numberOfLines={1}>{replyTo.messageBody}</Text>
            </View>
          </View>
        ) : null}
        <View style={{ padding: 10 }}>
          <View
            style={{
              flexDirection: 'row'
            }}
          >
            <View
              style={{
                flex: 1,
                padding: 10,
                backgroundColor: '#ededed',
                borderRadius: paperTheme.roundness,
                marginRight: 10
              }}
            >
              <TextInput
                style={{
                  borderWidth: 0,
                  padding: 0,
                  margin: 0,
                  paddingBottom: 3
                }}
                textAlignVertical="top"
                value={messageBody}
                onChangeText={onChangeText}
                maxLength={3000}
                multiline
                placeholder="Send a message"
              />
            </View>
            <View style={{ justifyContent: 'center' }}>
              <IconButton
                onPress={send}
                icon={SendIcon}
                disabled={!messageBody}
              />
            </View>
          </View>
          <Caption style={{ marginTop: 5 }}>
            {3000 - messageBody.length} character(s) remaining
          </Caption>
        </View>
      </View>
    </View>
  );
}

export default React.memo(ChatMessageInputBox);
