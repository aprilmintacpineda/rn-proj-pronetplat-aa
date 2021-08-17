import { useNavigation } from '@react-navigation/native';
import { emitEvent } from 'fluxible-js';
import React from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import Button from 'components/Button';
import { unknownErrorPopup } from 'fluxible/actions/popup';
import { xhr } from 'libs/xhr';

function CancelGoing ({ event }) {
  const [isCancelling, setIsCancelling] = React.useState(false);
  const { setParams } = useNavigation();

  const cancelGoing = React.useCallback(async () => {
    try {
      setIsCancelling(true);

      await xhr(`/events/cancel-going/${event.id}`, {
        method: 'delete'
      });

      emitEvent('cancelledGoing', event.id);

      setParams({
        ...event,
        isGoing: false
      });
    } catch (error) {
      console.log(error);
      unknownErrorPopup();
      setIsCancelling(false);
    }
  }, [event, setParams]);

  return (
    <View style={{ marginTop: 10 }}>
      <Text>You are going to this event</Text>
      <Button
        mode="contained"
        style={{ marginVertical: 10 }}
        onPress={cancelGoing}
        loading={isCancelling}
      >
        Cancel
      </Button>
    </View>
  );
}

export default React.memo(CancelGoing);
