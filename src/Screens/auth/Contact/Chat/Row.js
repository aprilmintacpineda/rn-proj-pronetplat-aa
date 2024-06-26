import { useRoute } from '@react-navigation/core';
import { emitEvent } from 'fluxible-js';
import React from 'react';
import useFluxibleStore from 'react-fluxible/lib/useFluxibleStore';
import { View } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { ActivityIndicator, Text } from 'react-native-paper';
import Caption from 'components/Caption';
import { DataFetchContext } from 'components/DataFetch';
import IconButton from 'components/IconButton';
import RNVectorIcon from 'components/RNVectorIcon';
import { renderLinks } from 'libs/strings';
import { formatDate } from 'libs/time';
import { getPersonalPronoun, shortenName } from 'libs/user';
import { xhr } from 'libs/xhr';
import { paperTheme } from 'theme';

function mapStates ({ authUser }) {
  return { authUser };
}

function ChatMessage ({ index, ...chatMessage }) {
  const {
    id,
    recipientId,
    messageBody,
    createdAt,
    toSend = false,
    seenAt,
    replyTo
  } = chatMessage;
  const { authUser } = useFluxibleStore(mapStates);
  const { params: contact } = useRoute();
  const { data } = React.useContext(DataFetchContext);
  const prevItem = data && data[index - 1];
  const nextItem = data && data[index + 1];
  const swipeableRef = React.useRef(null);
  const [status, setStatus] = React.useState('initial');

  const isChainedPrev = prevItem?.recipientId === recipientId;
  const isChainedNext = nextItem?.recipientId === recipientId;
  const isPrevHasReplyTo = isChainedPrev && prevItem.replyTo;
  const isReceived = recipientId === authUser.id;
  const roundness = paperTheme.roundness * 4;

  const body = React.useMemo(
    () => renderLinks(messageBody),
    [messageBody]
  );

  const sendChatMessage = React.useCallback(async () => {
    try {
      setStatus('sending');

      let chatMessage = await xhr(
        `/send-chat-message/${contact.id}`,
        {
          method: 'post',
          body: {
            messageBody,
            replyToMessageId: replyTo?.id
          }
        }
      );

      chatMessage = await chatMessage.json();

      emitEvent('chatMessageSendSuccess', {
        tempId: id,
        sentChatMessage: chatMessage,
        contact
      });
    } catch (error) {
      console.log(error);
      setStatus('sendFailed');
    }
  }, [id, contact, replyTo, messageBody]);

  const cancelSend = React.useCallback(() => {
    emitEvent('cancelSend', id);
  }, [id]);

  const renderActions = React.useCallback(() => {
    return (
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          marginRight: 10,
          marginLeft: 10
        }}
      >
        <RNVectorIcon
          provider="Ionicons"
          name="ios-arrow-undo-outline"
          color={paperTheme.colors.primary}
          size={30}
        />
      </View>
    );
  }, []);

  const onReply = React.useCallback(() => {
    swipeableRef.current.close();
    emitEvent('replyToChatMessage', chatMessage);
  }, [chatMessage]);

  React.useEffect(() => {
    if (toSend && status === 'initial') sendChatMessage();
    else if (!toSend && status === 'sending')
      setStatus('sendSuccess');
  }, [toSend, status, sendChatMessage]);

  const isError = status === 'sendFailed';

  return (
    <>
      <Swipeable
        ref={swipeableRef}
        onSwipeableRightWillOpen={isReceived ? null : onReply}
        renderRightActions={isReceived ? null : renderActions}
        onSwipeableLeftWillOpen={isReceived ? onReply : null}
        renderLeftActions={isReceived ? renderActions : null}
        enabled={Boolean(createdAt)}
        overshootLeft={false}
        overshootRight={false}
        overshootFriction={8}
      >
        <View
          style={{
            flex: 1,
            marginTop: isChainedNext ? 0.5 : 10,
            marginBottom:
              isChainedPrev && !isPrevHasReplyTo ? 0.5 : 10,
            flexDirection: isReceived ? 'row' : 'row-reverse'
          }}
        >
          <View
            style={{
              flex: 1,
              flexDirection: isReceived ? 'row' : 'row-reverse',
              alignItems: 'center',
              paddingRight: 55,
              paddingLeft: 5
            }}
          >
            <View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: !isReceived
                    ? 'flex-end'
                    : 'flex-start'
                }}
              >
                {replyTo ? (
                  <View>
                    <Caption>
                      {isReceived
                        ? `${shortenName(
                            contact.firstName
                          )} replied to ${
                            replyTo.senderId === authUser.id
                              ? 'you'
                              : `${
                                  getPersonalPronoun(contact)
                                    .objective.lowercase
                                }self`
                          }`
                        : `You replied to ${
                            replyTo.senderId === authUser.id
                              ? 'yourself'
                              : `${shortenName(contact.firstName)}`
                          }`}
                    </Caption>
                    <View
                      style={{
                        paddingVertical: 10,
                        paddingHorizontal: 15,
                        paddingBottom: 40,
                        backgroundColor: '#ededed',
                        borderRadius: roundness,
                        marginBottom: -30
                      }}
                    >
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'flex-end'
                        }}
                      >
                        <RNVectorIcon
                          provider="Feather"
                          name={
                            replyTo.recipientId === authUser.id
                              ? 'arrow-down-left'
                              : 'arrow-up-right'
                          }
                          color={paperTheme.colors.caption}
                          size={15}
                        />
                        <Caption style={{ marginLeft: 5 }}>
                          {formatDate(replyTo.createdAt)}
                        </Caption>
                      </View>
                      <Text
                        style={{
                          color: paperTheme.colors.caption
                        }}
                      >
                        {replyTo.messageBody}
                      </Text>
                    </View>
                  </View>
                ) : null}
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: !isReceived
                    ? 'flex-end'
                    : 'flex-start'
                }}
              >
                <View
                  style={{
                    paddingVertical: 10,
                    paddingHorizontal: 15,
                    backgroundColor: isReceived
                      ? '#e6e6e6'
                      : paperTheme.colors.accent,
                    borderRadius: roundness,
                    borderTopLeftRadius: !isReceived
                      ? roundness
                      : isChainedNext && !replyTo
                      ? 0
                      : roundness,
                    borderBottomLeftRadius: !isReceived
                      ? roundness
                      : isChainedPrev && !isPrevHasReplyTo
                      ? 0
                      : roundness,
                    borderTopRightRadius: isReceived
                      ? roundness
                      : isChainedNext && !replyTo
                      ? 0
                      : roundness,
                    borderBottomRightRadius: isReceived
                      ? roundness
                      : isChainedPrev && !isPrevHasReplyTo
                      ? 0
                      : roundness
                  }}
                >
                  <Text
                    selectable
                    style={{
                      color: isReceived
                        ? paperTheme.colors.text
                        : '#fff'
                    }}
                  >
                    {body}
                  </Text>
                  {isError ? (
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginTop: 5
                      }}
                    >
                      <RNVectorIcon
                        provider="AntDesign"
                        name="warning"
                        color={paperTheme.colors.error}
                        style={{ marginRight: 10 }}
                      />
                      <Caption color={paperTheme.colors.error}>
                        Failed to send.
                      </Caption>
                    </View>
                  ) : toSend || status === 'sending' ? (
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginTop: 5
                      }}
                    >
                      <ActivityIndicator
                        size={10}
                        color="#fff"
                        style={{ marginRight: 10 }}
                      />
                      <Caption>sending...</Caption>
                    </View>
                  ) : (
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        marginTop: 5
                      }}
                    >
                      <RNVectorIcon
                        provider="Feather"
                        name={
                          isReceived
                            ? 'arrow-down-left'
                            : 'arrow-up-right'
                        }
                        color={paperTheme.colors.caption}
                        size={15}
                      />
                      <Caption style={{ marginLeft: 5 }}>
                        {formatDate(createdAt)}
                      </Caption>
                    </View>
                  )}
                  {!isReceived && seenAt && (
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'flex-end'
                      }}
                    >
                      <RNVectorIcon
                        provider="Ionicons"
                        name="ios-checkmark"
                        color={paperTheme.colors.caption}
                        size={15}
                      />
                      <Caption style={{ marginLeft: 5 }}>
                        {formatDate(seenAt)}
                      </Caption>
                    </View>
                  )}
                </View>
              </View>
            </View>
            {isError && (
              <>
                <IconButton
                  viewStyle={{ marginRight: 5 }}
                  onPress={sendChatMessage}
                  icon={props => (
                    <RNVectorIcon
                      provider="Ionicons"
                      name="ios-reload-outline"
                      {...props}
                    />
                  )}
                />
                <IconButton
                  viewStyle={{ marginRight: 5 }}
                  onPress={cancelSend}
                  icon={props => (
                    <RNVectorIcon
                      provider="Ionicons"
                      name="trash-outline"
                      {...props}
                    />
                  )}
                />
              </>
            )}
          </View>
        </View>
      </Swipeable>
    </>
  );
}

export default React.memo(ChatMessage);
