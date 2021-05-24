import { useRoute } from '@react-navigation/core';
import { format, isToday } from 'date-fns';
import React from 'react';
import useFluxibleStore from 'react-fluxible/lib/useFluxibleStore';
import { View } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';
import Caption from 'components/Caption';
import { DataFetchContext } from 'components/DataFetch';
import RNVectorIcon from 'components/RNVectorIcon';
import TextLink from 'components/TextLink';
import UserAvatar from 'components/UserAvatar';
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
  recipientId,
  messageBody,
  createdAt,
  isSending = false,
  seenAt,
  index
}) {
  const { authUser } = useFluxibleStore(mapStates);
  const { params: contact } = useRoute();
  const { data } = React.useContext(DataFetchContext);
  const prevItem = data && data[index - 1];
  const nextItem = data && data[index + 1];

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

  return (
    <View
      style={{
        marginTop: isChainedNext ? 0.5 : 10,
        marginBottom: isChainedPrev ? 0.5 : 10,
        marginHorizontal: 10,
        flexDirection: isReceived ? 'row' : 'row-reverse',
        justifyContent: 'flex-start',
        alignItems: 'flex-end'
      }}
    >
      {isReceived && (
        <UserAvatar
          size={40}
          user={isReceived ? contact : authUser}
          hidden={isChainedPrev}
        />
      )}
      <View
        style={{
          flex: 1,
          flexDirection: isReceived ? 'row' : 'row-reverse'
        }}
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
          {isSending ? (
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
          {!isReceived && seenAt && (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-end'
              }}
            >
              <RNVectorIcon
                provider="AntDesign"
                name="check"
                color={paperTheme.colors.caption}
                size={10}
              />
              <Caption style={{ marginLeft: 5 }}>
                {formatDate(seenAt)}
              </Caption>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

export default React.memo(ChatMessage);
