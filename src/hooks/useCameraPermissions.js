import React from 'react';
import { Platform } from 'react-native';
import { PERMISSIONS, checkMultiple } from 'react-native-permissions';

import useAppStateEffect from './useAppStateEffect';

const permissions = Platform.select({
  ios: [PERMISSIONS.IOS.CAMERA, PERMISSIONS.IOS.MICROPHONE],
  android: [PERMISSIONS.ANDROID.CAMERA, PERMISSIONS.ANDROID.RECORD_AUDIO]
});

function useCameraPermission () {
  const [{ isAllowed, status }, setState] = React.useState({
    isAllowed: false,
    status: 'initial'
  });

  const isInitial = status === 'initial';
  const isChecking = status === 'checking';
  const isDoneChecking = status === 'checked';

  const checkPermissions = React.useCallback(async () => {
    if (isAllowed) return;

    const results = await checkMultiple(permissions);

    const allowed = !Object.keys(results).find(
      permission => results[permission].toLowerCase() !== 'granted'
    );

    setState({
      isAllowed: allowed,
      status: 'checked'
    });
  }, [isAllowed]);

  React.useEffect(() => {
    if (isInitial) checkPermissions();
  }, [isInitial, checkPermissions]);

  useAppStateEffect({
    onActive: checkPermissions
  });

  return { isAllowed, checkPermissions, status, isInitial, isChecking, isDoneChecking };
}

export default useCameraPermission;
