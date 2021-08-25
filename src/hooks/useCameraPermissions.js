import React from 'react';
import { Platform } from 'react-native';
import { PERMISSIONS, request } from 'react-native-permissions';
import useAppStateEffect from './useAppStateEffect';

const permissions = Platform.select({
  ios: PERMISSIONS.IOS.CAMERA,
  android: PERMISSIONS.ANDROID.CAMERA
});

function useCameraPermission ({ shouldAsk = true } = {}) {
  const [status, setStatus] = React.useState('initial');

  const askPermission = React.useCallback(async () => {
    if (status !== 'initial') return;

    setStatus('requesting');
    const results = await request(permissions);
    setStatus(results === 'granted' ? 'granted' : 'denied');
  }, [status]);

  React.useEffect(() => {
    if (status === 'initial' && shouldAsk) askPermission();
  }, [status, askPermission, shouldAsk]);

  useAppStateEffect({
    onActive: askPermission
  });

  return {
    askPermission,
    status
  };
}

export default useCameraPermission;
