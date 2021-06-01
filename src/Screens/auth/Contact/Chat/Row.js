import { useRoute } from '@react-navigation/core';
import { format, isToday } from 'date-fns';
import { emitEvent } from 'fluxible-js';
import React from 'react';
import useFluxibleStore from 'react-fluxible/lib/useFluxibleStore';
import { TouchableWithoutFeedback, View } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';
import Button from 'components/Button';
import Caption from 'components/Caption';
import { DataFetchContext } from 'components/DataFetch';
import Modalize from 'components/Modalize';
import RNVectorIcon from 'components/RNVectorIcon';
import TextLink from 'components/TextLink';
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

function ChatMessage ({
  id,
  recipientId,
  messageBody,
  createdAt,
  toSend = false,
  seenAt,
  index
}) {
  const { authUser } = useFluxibleStore(mapStates);
  const { params: contact } = useRoute();
  const { data } = React.useContext(DataFetchContext);
  const prevItem = data && data[index - 1];
  const nextItem = data && data[index + 1];
  const modalizeRef = React.useRef(null);
  const [status, setStatus] = React.useState('initial');

  const isChainedPrev = prevItem?.recipientId === recipientId;
  const isChainedNext = nextItem?.recipientId === recipientId;
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

  const showOptions = React.useCallback(() => {
    modalizeRef.current.open();
  }, []);

  const sendChatMessage = React.useCallback(async () => {
    try {
      if (modalizeRef.current) modalizeRef.current.close();

      setStatus('sending');

      let chatMessage = await xhr(
        `/send-chat-message/${contact.id}`,
        {
          method: 'post',
          body: { messageBody }
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
  }, [id, contact.id, messageBody]);

  React.useEffect(() => {
    if (toSend && status === 'initial') sendChatMessage();
    else if (!toSend && status === 'sending')
      setStatus('sendSuccess');
  }, [toSend, status, sendChatMessage]);

  return (
    <>
      <View
        style={{
          marginTop: isChainedNext ? 0.5 : 10,
          marginBottom: isChainedPrev ? 0.5 : 10,
          flexDirection: isReceived ? 'row' : 'row-reverse'
        }}
      >
        <View
          style={{
            flex: 1,
            flexDirection: isReceived ? 'row' : 'row-reverse'
          }}
        >
          <TouchableWithoutFeedback
            onPress={status === 'sendFailed' ? showOptions : null}
          >
            <View
              style={{
                marginLeft: isReceived ? 5 : 100,
                marginRight: isReceived ? 55 : 5,
                paddingVertical: 10,
                paddingHorizontal: 15,
                backgroundColor: isReceived
                  ? '#e6e6e6'
                  : paperTheme.colors.accent,
                opacity: status === 'sendFailed' ? 0.5 : 1,
                borderRadius: roundness,
                borderTopLeftRadius:
                  isReceived && isChainedNext ? 0 : roundness,
                borderBottomLeftRadius:
                  isReceived && isChainedPrev ? 0 : roundness,
                borderTopRightRadius:
                  !isReceived && isChainedNext ? 0 : roundness,
                borderBottomRightRadius:
                  !isReceived && isChainedPrev ? 0 : roundness
              }}
            >
              {status === 'sendFailed' ? (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginBottom: 10
                  }}
                >
                  <RNVectorIcon
                    provider="AntDesign"
                    name="warning"
                    color={paperTheme.colors.error}
                    style={{ marginRight: 10 }}
                  />
                  <Caption color={paperTheme.colors.error}>
                    Failed to send. Tap to resend.
                  </Caption>
                </View>
              ) : toSend || status === 'sending' ? (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginBottom: 10
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
                <Caption style={{ marginBottom: 10 }}>
                  {formatDate(createdAt)}
                </Caption>
              )}
              <Text
                selectable
                style={{
                  color: isReceived ? paperTheme.colors.text : '#fff'
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
                      justifyContent: 'flex-end'
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
                ) : (
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'flex-end'
                    }}
                  >
                    <RNVectorIcon
                      provider="AntDesign"
                      name="checkcircleo"
                      color={paperTheme.colors.caption}
                      size={10}
                    />
                    <Caption style={{ marginLeft: 5 }}>Sent</Caption>
                  </View>
                )
              ) : null}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </View>
      <Modalize ref={modalizeRef}>
        <Button
          onPress={sendChatMessage}
          mode="contained"
          color={paperTheme.colors.primary}
          icon={props => (
            <RNVectorIcon
              provider="Ionicons"
              name="ios-arrow-undo-outline"
              {...props}
            />
          )}
        >
          Resend message
        </Button>
      </Modalize>
    </>
  );
}

export default React.memo(ChatMessage);
