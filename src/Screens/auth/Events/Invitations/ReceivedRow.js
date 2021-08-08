import React from 'react';
import { View } from 'react-native';
import { Caption, Text } from 'react-native-paper';
import Animatable from 'components/Animatable';
import TimeAgo from 'components/TimeAgo';
import TouchableRipple from 'components/TouchableRipple';
import UserAvatar from 'components/UserAvatar';
import { getFullName } from 'libs/user';

function ReceivedEventInvitationRow ({
  index,
  inviter,
  event,
  createdAt
}) {
  const delay = (index % 10) * 50;

  return (
    <Animatable animation="fadeInFromRight" delay={delay}>
      <TouchableRipple to="ViewEvent" params={event}>
        <View
          style={{
            flexDirection: 'row',
            margin: 15
          }}
        >
          <UserAvatar user={inviter} />
          <View
            style={{
              marginLeft: 15,
              flex: 1
            }}
          >
            <Text>
              <Text style={{ fontWeight: 'bold' }}>
                {getFullName(inviter)}
              </Text>{' '}
              invited you to join{' '}
              <Text style={{ fontWeight: 'bold' }}>
                {event.name}
              </Text>
            </Text>
            <Caption>
              <TimeAgo dateFrom={createdAt} />
            </Caption>
          </View>
        </View>
      </TouchableRipple>
    </Animatable>
  );
}

export default React.memo(ReceivedEventInvitationRow);
