import React from 'react';
import { View } from 'react-native';
import { Caption, Text } from 'react-native-paper';
import Animatable from 'components/Animatable';
import TimeAgo from 'components/TimeAgo';
import UserAvatar from 'components/UserAvatar';
import { getFullName } from 'libs/user';

function ReceivedEventInvitationRow ({
  index,
  invitee,
  event,
  createdAt
}) {
  const delay = (index % 10) * 50;

  return (
    <Animatable animation="fadeInFromRight" delay={delay}>
      <View
        style={{
          flexDirection: 'row',
          margin: 15
        }}
      >
        <UserAvatar user={invitee} />
        <View
          style={{
            marginLeft: 15,
            flex: 1
          }}
        >
          <Text>
            You invited{' '}
            <Text style={{ fontWeight: 'bold' }}>
              {getFullName(invitee)}
            </Text>{' '}
            to join{' '}
            <Text style={{ fontWeight: 'bold' }}>{event.name}</Text>
          </Text>
          <Caption>
            <TimeAgo dateFrom={createdAt} />
          </Caption>
        </View>
      </View>
    </Animatable>
  );
}

export default React.memo(ReceivedEventInvitationRow);
