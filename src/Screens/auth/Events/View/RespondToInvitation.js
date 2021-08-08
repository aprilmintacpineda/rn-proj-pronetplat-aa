import { useNavigation } from '@react-navigation/native';
import { emitEvent } from 'fluxible-js';
import React from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import Button from 'components/Button';
import UserAvatar from 'components/UserAvatar';
import { getFullName } from 'libs/user';
import { xhr } from 'libs/xhr';

function RespondToInvitation ({ event }) {
  const { id, inviter, invitationId } = event;
  const [action, setAction] = React.useState(null);
  const { setParams } = useNavigation();

  const accept = React.useCallback(async () => {
    setAction('accept');

    await xhr(`/events/accept-invitation/${id}`, {
      method: 'post'
    });

    setParams({
      ...event,
      isGoing: true,
      invitationId: null,
      inviter: null
    });

    emitEvent('respondedToEventInvitation', invitationId);
  }, [id, invitationId, event, setParams]);

  const reject = React.useCallback(async () => {
    setAction('reject');

    await xhr(`/events/reject-invitation/${id}`, {
      method: 'post'
    });

    setParams({
      ...event,
      invitationId: null,
      inviter: null
    });

    emitEvent('respondedToEventInvitation', invitationId);
  }, [invitationId, event, setParams, id]);

  if (!invitationId) return null;

  return (
    <View style={{ marginVertical: 10 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <UserAvatar size={30} user={inviter} />
        <Text style={{ marginLeft: 10 }}>
          <Text style={{ fontWeight: 'bold' }}>
            {getFullName(inviter)}
          </Text>{' '}
          invited you to join this event.
        </Text>
      </View>
      <View style={{ flexDirection: 'row', marginTop: 10 }}>
        <Button
          style={{ flex: 1, marginRight: 5 }}
          mode="contained"
          onPress={accept}
          disabled={action !== null}
          loading={action === 'accept'}
        >
          Accept
        </Button>
        <Button
          style={{ flex: 1, marginLeft: 5 }}
          mode="outlined"
          onPress={reject}
          disabled={action !== null}
          loading={action === 'reject'}
        >
          Reject
        </Button>
      </View>
    </View>
  );
}

export default React.memo(RespondToInvitation);