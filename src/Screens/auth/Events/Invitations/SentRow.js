import { emitEvent } from 'fluxible-js';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Caption, Text } from 'react-native-paper';
import Animatable from 'components/Animatable';
import IconButton from 'components/IconButton';
import RNVectorIcon from 'components/RNVectorIcon';
import TimeAgo from 'components/TimeAgo';
import UserAvatar from 'components/UserAvatar';
import { unknownErrorPopup } from 'fluxible/actions/popup';
import { getFullName } from 'libs/user';
import { xhr } from 'libs/xhr';
import { paperTheme } from 'theme';

function removeIcon (props) {
  return (
    <RNVectorIcon
      {...props}
      provider="Ionicons"
      name="ios-close-outline"
    />
  );
}

function SentEventInvitationRow ({
  index,
  id,
  invitee,
  event,
  createdAt
}) {
  const delay = (index % 10) * 50;
  const [isRemoving, setIsRemoving] = React.useState(false);

  const handleRemove = React.useCallback(async () => {
    try {
      setIsRemoving(true);

      await xhr(`/events/cancel-invitation/${id}`, {
        method: 'delete'
      });

      emitEvent('cancelledInvitation', id);
    } catch (error) {
      console.log(error);
      unknownErrorPopup();
      setIsRemoving(false);
    }
  }, [id]);

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
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center'
          }}
        >
          <View style={{ flex: 1 }}>
            <Text>
              You invited{' '}
              <Text style={{ fontWeight: 'bold' }}>
                {getFullName(invitee)}
              </Text>{' '}
              to join{' '}
              <Text style={{ fontWeight: 'bold' }}>
                {event.name}
              </Text>
            </Text>
            <Caption>
              <TimeAgo dateFrom={createdAt} />
            </Caption>
          </View>
          {isRemoving ? (
            <View
              style={{
                backgroundColor: paperTheme.colors.primary,
                borderRadius: 100,
                padding: 5
              }}
            >
              <ActivityIndicator size={20} color="#fff" />
            </View>
          ) : (
            <IconButton
              icon={removeIcon}
              onPress={handleRemove}
              size={20}
            />
          )}
        </View>
      </View>
    </Animatable>
  );
}

export default React.memo(SentEventInvitationRow);
