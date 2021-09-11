import { useNavigation } from '@react-navigation/native';
import { emitEvent, store, updateStore } from 'fluxible-js';
import React from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import Button from 'components/Button';
import UserAvatar from 'components/UserAvatar';
import { unknownErrorPopup } from 'fluxible/actions/popup';
import { getFullName } from 'libs/user';
import { xhr } from 'libs/xhr';
import { paperTheme } from 'theme';

function RespondToInvitation ({ event }) {
  const { inviter, invitationId } = event;
  const [action, setAction] = React.useState(null);
  const { setParams } = useNavigation();

  const accept = React.useCallback(async () => {
    try {
      setAction('accept');

      await xhr(`/events/accept-invitation/${invitationId}`, {
        method: 'post'
      });

      setParams({
        ...event,
        isGoing: true,
        invitationId: null,
        inviter: null
      });

      updateStore({
        authUser: {
          ...store.authUser,
          eventInvitationsCount:
            store.authUser.eventInvitationsCount - 1
        }
      });

      emitEvent('respondedToEventInvitation', event.id);
    } catch (error) {
      console.log(error);
      setAction(null);
      unknownErrorPopup();
    }
  }, [invitationId, event, setParams]);

  const reject = React.useCallback(async () => {
    try {
      setAction('reject');

      await xhr(`/events/reject-invitation/${invitationId}`, {
        method: 'post'
      });

      setParams({
        ...event,
        invitationId: null,
        inviter: null
      });

      updateStore({
        authUser: {
          ...store.authUser,
          eventInvitationsCount:
            store.authUser.eventInvitationsCount - 1
        }
      });

      emitEvent('respondedToEventInvitation', event.id);
    } catch (error) {
      console.log(error);
      setAction(null);
      unknownErrorPopup();
    }
  }, [invitationId, event, setParams]);

  if (!invitationId) return null;

  return (
    <>
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
          color={paperTheme.colors.error}
        >
          Reject
        </Button>
      </View>
    </>
  );
}

export default React.memo(RespondToInvitation);
