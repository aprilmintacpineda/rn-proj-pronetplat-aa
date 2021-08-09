import { useNavigation } from '@react-navigation/native';
import { emitEvent } from 'fluxible-js';
import React from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import Button from 'components/Button';
import { unknownErrorPopup } from 'fluxible/actions/popup';
import { xhr } from 'libs/xhr';
import { paperTheme } from 'theme';

function JoinEvent ({ event }) {
  const [isJoining, setIsJoining] = React.useState(false);
  const { setParams } = useNavigation();
  const { maxAttendees, numGoing } = event;

  const join = React.useCallback(async () => {
    try {
      setIsJoining(true);
      await xhr(`/events/join/${event.id}`, { method: 'post' });
      emitEvent('joinedEvent', event.id);

      setParams({
        ...event,
        isGoing: true
      });
    } catch (error) {
      console.log(error);
      unknownErrorPopup();
      setIsJoining(false);
    }
  }, [event, setParams]);

  if (numGoing >= maxAttendees) {
    return (
      <View style={{ marginTop: 10 }}>
        <Text style={{ color: paperTheme.colors.error }}>
          Event is full.
        </Text>
      </View>
    );
  }

  return (
    <View style={{ marginTop: 10 }}>
      <Button
        mode="contained"
        style={{ marginVertical: 10 }}
        onPress={join}
        loading={isJoining}
      >
        Join event
      </Button>
    </View>
  );
}

export default React.memo(JoinEvent);
