import { useRoute } from '@react-navigation/core';
import { format, isToday } from 'date-fns';
import React from 'react';
import useFluxibleStore from 'react-fluxible/lib/useFluxibleStore';
import { View } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';
import Caption from 'components/Caption';
import { DataFetchContext } from 'components/DataFetch';
import UserAvatar from 'components/UserAvatar';
import { paperTheme } from 'theme';

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
  const dateSent = new Date(createdAt);
  const dateSeen = seenAt ? new Date(seenAt) : null;
  const isReceived = recipientId === authUser.id;
  const roundness = paperTheme.roundness * 4;

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
              {isToday(dateSent)
                ? `Today, ${format(dateSent, 'p')}`
                : format(dateSent, 'PPp')}
            </Caption>
          )}
          <Text
            style={{
              color: isReceived ? paperTheme.colors.text : '#fff'
            }}
          >
            {messageBody}
          </Text>
          {dateSeen && (
            <Caption style={{ marginBottom: 10 }}>
              {isToday(dateSeen)
                ? `Seen today, ${format(dateSeen, 'p')}`
                : `Seen ${format(dateSeen, 'PPp')}`}
            </Caption>
          )}
        </View>
      </View>
    </View>
  );
}

export default React.memo(ChatMessage);
