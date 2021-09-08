import React from 'react';
import useFluxibleStore from 'react-fluxible/lib/useFluxibleStore';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import Animatable from 'components/Animatable';
import Caption from 'components/Caption';
import RNVectorIcon from 'components/RNVectorIcon';
import TouchableRipple from 'components/TouchableRipple';
import UserAvatar from 'components/UserAvatar';
import { formatDate } from 'libs/time';
import { getFullName } from 'libs/user';
import { paperTheme } from 'theme';

function mapStates ({ authUser }) {
  return { authUser };
}

function InboxRow ({ index, ...inbox }) {
  const { authUser } = useFluxibleStore(mapStates);
  const { contact, lastMessage, isTyping } = inbox;
  const fullName = getFullName(contact);
  const delay = (index % 10) * 50;

  return (
    <Animatable animation="fadeInFromRight" delay={delay}>
      <TouchableRipple to="ContactChat" params={contact}>
        <View
          style={{
            flexDirection: 'row',
            margin: 15
          }}
        >
          <UserAvatar
            user={contact}
            badge={inbox.numUnreadChatMessages}
          />
          <View
            style={{
              marginLeft: 15,
              flex: 1,
              justifyContent: 'center'
            }}
          >
            <Text numberOfLines={1} style={{ fontSize: 18 }}>
              {fullName}
            </Text>
            <Text numberOfLines={1}>
              {lastMessage.senderId === authUser.id ? (
                <>
                  <Text style={{ fontWeight: 'bold' }}>You: </Text>
                  <Text>{lastMessage.messageBody}</Text>
                </>
              ) : (
                lastMessage.messageBody
              )}
            </Text>
            {isTyping ? (
              <Caption style={{ fontStyle: 'italic' }}>
                {`${contact.firstName} is typing...`}
              </Caption>
            ) : (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center'
                }}
              >
                <RNVectorIcon
                  provider={
                    lastMessage.senderId === authUser.id &&
                    lastMessage.seenAt
                      ? 'Ionicons'
                      : 'Feather'
                  }
                  name={
                    lastMessage.senderId === authUser.id
                      ? lastMessage.seenAt
                        ? 'ios-checkmark'
                        : 'arrow-up-right'
                      : 'arrow-down-left'
                  }
                  color={paperTheme.colors.caption}
                  size={15}
                />
                <Caption style={{ marginLeft: 5 }}>
                  {lastMessage.senderId === authUser.id
                    ? lastMessage.seenAt
                      ? formatDate(lastMessage.seenAt)
                      : formatDate(lastMessage.createdAt)
                    : formatDate(lastMessage.createdAt)}
                </Caption>
              </View>
            )}
          </View>
        </View>
      </TouchableRipple>
    </Animatable>
  );
}

export default React.memo(InboxRow);
