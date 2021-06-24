import React from 'react';
import { Platform } from 'react-native';
import { PERMISSIONS, request } from 'react-native-permissions';
import useAppStateEffect from './useAppStateEffect';

const permissions = Platform.select({
  ios: PERMISSIONS.IOS.CAMERA,
  android: PERMISSIONS.ANDROID.CAMERA
});

function useCameraPermission ({ shouldAsk }) {
  const [{ isAllowed, status }, setState] = React.useState({
    isAllowed: false,
    status: 'initial'
  });

  const isInitial = status === 'initial';
  const isChecking = status === 'checking';
  const isDoneChecking = status === 'checked';

  const askPermission = React.useCallback(async () => {
    if (isAllowed || !shouldAsk) return;
    const results = await request(permissions);

    setState({
      isAllowed: results === 'granted',
      status: 'checked'
    });
  }, [isAllowed, shouldAsk]);

  React.useEffect(() => {
    if (isInitial) askPermission();
  }, [isInitial, askPermission]);

  useAppStateEffect({
    onActive: askPermission
  });

  return {
    isAllowed,
    askPermission,
    status,
    isInitial,
    isChecking,
    isDoneChecking
  };
}

export default useCameraPermission;
