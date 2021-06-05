import { useRoute } from '@react-navigation/core';
import { format, isToday } from 'date-fns';
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
import TextLink from 'components/TextLink';
import { getPersonalPronoun, shortenName } from 'libs/user';
import { xhr } from 'libs/xhr';
import { paperTheme } from 'theme';

function formatDate (dateStr) {
  const date = new Date(dateStr);

  return isToday(date)
    ? `Today, ${format(date, 'p')}`
    : format(date, 'PPp');
}

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
  const isNextHasReplyTo = isChainedNext && nextItem.replyTo;
  const isReceived = recipientId === authUser.id;
  const roundness = paperTheme.roundness * 4;

  const body = React.useMemo(() => {
    const pattern =
      /(?:https?:\/\/)?(?:[a-zA-Z]+(?:[a-zA-Z0-9-]+)?\.)?[a-zA-Z]+(?:[a-zA-Z0-9-]+)?\.[a-zA-Z0-9.]+\S*/gim;
    const body = [];
    // setup starting index for first loop
    let startingIndex = 0;
    let match = pattern.exec(messageBody);

    // grab all links
    while (match) {
      // grab the texts before the link
      body.push(messageBody.slice(startingIndex, match.index));

      // make sure the url always has a protocol to
      let url = match[0];
      if (!/^https?:\/\//gim.test(url)) url = `https://${url}`;

      // push the link making it pressable
      body.push(
        <TextLink
          isExternal
          key={`${url}-${startingIndex}-${match.index}`}
          textMode
          to={url}
        >
          {url}
        </TextLink>
      );

      // set starting index of next loop
      startingIndex = pattern.lastIndex;
      // grab all other links
      match = pattern.exec(messageBody);
    }

    if (!body.length) return messageBody;

    // add the rest of the text
    body.push(messageBody.slice(startingIndex));

    return body;
  }, [messageBody]);

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
        sentChatMessage: chatMessage
      });
    } catch (error) {
      console.log(error);
      setStatus('sendFailed');
    }
  }, [id, contact.id, replyTo, messageBody]);

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
            marginBottom: isChainedPrev ? 0.5 : 10,
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
              {replyTo ? (
                <View style={{ marginTop: isChainedPrev ? 5 : 0 }}>
                  <Caption>
                    {isReceived
                      ? `${shortenName(
                          contact.firstName
                        )} replied to ${
                          replyTo.senderId === authUser.id
                            ? 'you'
                            : `${
                                getPersonalPronoun(contact).objective
                                  .lowercase
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
                      paddingBottom: 30,
                      backgroundColor: '#d4d4d4',
                      borderTopLeftRadius: roundness,
                      borderTopRightRadius: roundness,
                      marginBottom: -20
                    }}
                  >
                    <Caption style={{ marginBottom: 5 }}>
                      {formatDate(replyTo.createdAt)}
                    </Caption>
                    <Text>{replyTo.messageBody}</Text>
                  </View>
                </View>
              ) : null}
              <View
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: 15,
                  backgroundColor: isReceived
                    ? '#e6e6e6'
                    : paperTheme.colors.accent,
                  borderRadius: roundness,
                  borderTopLeftRadius:
                    isReceived && isChainedNext && !replyTo
                      ? 0
                      : roundness,
                  borderBottomLeftRadius:
                    isReceived && isChainedPrev && isNextHasReplyTo
                      ? 0
                      : roundness,
                  borderTopRightRadius:
                    !isReceived && isChainedNext && !replyTo
                      ? 0
                      : roundness,
                  borderBottomRightRadius:
                    !isReceived && isChainedPrev && isNextHasReplyTo
                      ? 0
                      : roundness
                }}
              >
                {isError ? (
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginBottom: 5
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
                      marginBottom: 5
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
                  <Caption style={{ marginBottom: 5 }}>
                    {formatDate(createdAt)}
                  </Caption>
                )}
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
                {!isReceived ? (
                  seenAt ? (
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        marginTop: 5
                      }}
                    >
                      <RNVectorIcon
                        provider="AntDesign"
                        name="checkcircle"
                        color={paperTheme.colors.caption}
                        size={10}
                      />
                      <Caption style={{ marginLeft: 5 }}>
                        {formatDate(seenAt)}
                      </Caption>
                    </View>
                  ) : createdAt ? (
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        marginTop: 5
                      }}
                    >
                      <RNVectorIcon
                        provider="AntDesign"
                        name="checkcircleo"
                        color={paperTheme.colors.caption}
                        size={10}
                      />
                      <Caption style={{ marginLeft: 5 }}>
                        Sent
                      </Caption>
                    </View>
                  ) : null
                ) : null}
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
