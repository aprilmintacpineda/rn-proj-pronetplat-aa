import { useRoute } from '@react-navigation/core';
import { differenceInSeconds } from 'date-fns';
import { addEvent, emitEvent } from 'fluxible-js';
import React from 'react';
import { Platform, TextInput, View } from 'react-native';
import { Text } from 'react-native-paper';
import Caption from 'components/Caption';
import IconButton from 'components/IconButton';
import RNVectorIcon from 'components/RNVectorIcon';
import useAppStateEffect from 'hooks/useAppStateEffect';
import useState from 'hooks/useState';
import { getFullName, shortenName } from 'libs/user';
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
  const isTypingSendTimeout = React.useRef(null);
  const isTypingResetTimeout = React.useRef(null);
  const lastSentTime = React.useRef(null);
  const textInputRef = React.useRef(null);

  const send = React.useCallback(() => {
    if (!messageBody) return;

    clearTimeout(isTypingSendTimeout.current);

    emitEvent('chatMessageSending', {
      id: `${Math.random()}-${Math.random()}`,
      recipientId: contact.id,
      messageBody,
      replyTo,
      toSend: true
    });

    updateState({ messageBody: '', replyTo: null });

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
        ({ sender, payload: { isTyping } }) => {
          if (sender.id !== contact.id) return;

          clearTimeout(isTypingResetTimeout.current);
          updateState({ isTyping });

          if (isTyping) {
            isTypingResetTimeout.current = setTimeout(() => {
              updateState({ isTyping: false });
            }, 10000);
          }
        }
      ),
      addEvent('replyToChatMessage', replyTo => {
        updateState({ replyTo });
        textInputRef.current.focus();
      })
    ];

    return () => {
      removeListeners.forEach(removeListener => {
        removeListener();
      });
    };
  }, [contact, updateState]);

  const resetIsTyping = React.useCallback(() => {
    clearTimeout(isTypingSendTimeout.current);

    xhr(`/chat-typing-status/${contact.id}`, {
      method: 'post',
      body: {
        isTyping: false
      }
    });
  }, [contact]);

  useAppStateEffect({
    onBackground: resetIsTyping
  });

  const onChangeText = React.useCallback(
    value => {
      clearTimeout(isTypingSendTimeout.current);
      isTypingSendTimeout.current = setTimeout(resetIsTyping, 5000);
      updateState({ messageBody: value });

      if (
        !lastSentTime.current ||
        differenceInSeconds(new Date(), lastSentTime.current) >= 3
      ) {
        xhr(`/chat-typing-status/${contact.id}`, {
          method: 'post',
          body: {
            isTyping: true
          }
        });

        lastSentTime.current = new Date();
      }
    },
    [contact, updateState, resetIsTyping]
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
              <Text>
                Replying to{' '}
                <Text style={{ fontWeight: 'bold' }}>
                  {replyTo.senderId === contact.id
                    ? getFullName(contact)
                    : 'yourself'}
                </Text>
              </Text>
              <Caption numberOfLines={2}>
                {replyTo.messageBody}
              </Caption>
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
                marginRight: 10,
                justifyContent: 'center'
              }}
            >
              <TextInput
                ref={textInputRef}
                style={{
                  borderWidth: 0,
                  padding: 0,
                  margin: 0,
                  paddingBottom: Platform.OS === 'ios' ? 3 : 0
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
