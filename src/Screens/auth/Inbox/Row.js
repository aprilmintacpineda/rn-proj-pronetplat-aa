import React from 'react';
import useFluxibleStore from 'react-fluxible/lib/useFluxibleStore';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import Animatable from 'components/Animatable';
import Caption from 'components/Caption';
import TouchableRipple from 'components/TouchableRipple';
import UserAvatar from 'components/UserAvatar';
import { formatDate } from 'libs/time';
import { getFullName } from 'libs/user';

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
              {lastMessage.senderId === authUser.id
                ? `You: ${lastMessage.messageBody}`
                : lastMessage.messageBody}
            </Text>
            <Caption
              style={{ fontStyle: isTyping ? 'italic' : 'normal' }}
            >
              {isTyping
                ? `${contact.firstName} is typing...`
                : lastMessage.senderId === authUser.id
                ? lastMessage.seenAt
                  ? `Seen ${formatDate(lastMessage.seenAt)}`
                  : `Sent ${formatDate(lastMessage.createdAt)}`
                : `Received ${formatDate(lastMessage.createdAt)}`}
            </Caption>
          </View>
        </View>
      </TouchableRipple>
    </Animatable>
  );
}

export default React.memo(InboxRow);
