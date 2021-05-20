import { useRoute } from '@react-navigation/core';
import { format, isToday } from 'date-fns';
import React from 'react';
import useFluxibleStore from 'react-fluxible/lib/useFluxibleStore';
import { View } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';
import Caption from 'components/Caption';
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
  seenAt
}) {
  const { authUser } = useFluxibleStore(mapStates);
  const { params: contact } = useRoute();
  const dateSent = new Date(createdAt);
  const dateSeen = seenAt ? new Date(seenAt) : null;
  const isReceived = recipientId === authUser.id;

  return (
    <View
      style={{
        marginBottom: 10,
        marginHorizontal: 10,
        flexDirection: isReceived ? 'row' : 'row-reverse',
        justifyContent: 'flex-start',
        alignItems: 'flex-end'
      }}
    >
      <UserAvatar size={40} user={isReceived ? contact : authUser} />
      <View
        style={{
          flex: 1,
          flexDirection: isReceived ? 'row' : 'row-reverse'
        }}
      >
        <View
          style={{
            marginLeft: isReceived ? 5 : 45,
            marginRight: isReceived ? 45 : 5,
            paddingVertical: 10,
            paddingHorizontal: 15,
            backgroundColor: isReceived
              ? '#e6e6e6'
              : paperTheme.colors.accent,
            borderRadius: paperTheme.roundness
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
