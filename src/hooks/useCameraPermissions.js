import React from 'react';
import { Platform } from 'react-native';
import {
  PERMISSIONS,
  requestMultiple
} from 'react-native-permissions';
import useAppStateEffect from './useAppStateEffect';

const permissions = Platform.select({
  ios: [PERMISSIONS.IOS.CAMERA],
  android: [PERMISSIONS.ANDROID.CAMERA]
});

function useCameraPermission () {
  const [{ isAllowed, status }, setState] = React.useState({
    isAllowed: false,
    status: 'initial'
  });

  const isInitial = status === 'initial';
  const isChecking = status === 'checking';
  const isDoneChecking = status === 'checked';

  const askPermission = React.useCallback(async () => {
    if (isAllowed) return;

    const results = await requestMultiple(permissions);

    const wasAllowed = !Object.keys(results).find(
      permission => results[permission].toLowerCase() !== 'granted'
    );

    setState({
      isAllowed: wasAllowed,
      status: 'checked'
    });
  }, [isAllowed]);

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
