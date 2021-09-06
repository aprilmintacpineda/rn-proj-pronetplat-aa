import { useNavigation } from '@react-navigation/native';
import { emitEvent } from 'fluxible-js';
import React from 'react';
import Button from 'components/Button';
import {
  showConfirmDialog,
  unknownErrorPopup
} from 'fluxible/actions/popup';
import { xhr } from 'libs/xhr';
import { paperTheme } from 'theme';

function CancelGoing ({ event }) {
  const [isCancelling, setIsCancelling] = React.useState(false);
  const { setParams } = useNavigation();

  const confirmCancelGoing = React.useCallback(async () => {
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

  const cancelGoing = React.useCallback(() => {
    showConfirmDialog({
      message: `Are you sure you are not going to ${event.name} anymore?`,
      onConfirm: confirmCancelGoing,
      isDestructive: true
    });
  }, [event, confirmCancelGoing]);

  return (
    <Button
      mode="outlined"
      onPress={cancelGoing}
      loading={isCancelling}
      color={paperTheme.colors.error}
    >
      Cancel Going
    </Button>
  );
}

export default React.memo(CancelGoing);
