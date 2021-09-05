import geolocation from '@react-native-community/geolocation';
import React from 'react';
import { Platform } from 'react-native';
import { PERMISSIONS, request } from 'react-native-permissions';
import useAppStateEffect from './useAppStateEffect';
import useState from './useState';
import { showConfirmDialog } from 'fluxible/actions/popup';

const permission = Platform.select({
  ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
  android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
});

function useUserLocation ({ shouldAsk = true } = {}) {
  const {
    state: { status, coordinates },
    updateState
  } = useState({
    status: 'initial',
    coordinates: {
      lat: null,
      lng: null
    }
  });

  const getCurrentPosition = React.useCallback(async () => {
    try {
      const currentPosition = await new Promise(
        (resolve, reject) => {
          geolocation.getCurrentPosition(resolve, reject, {
            maximumAge: 0,
            enableHighAccuracy: true
          });
        }
      );

      updateState({
        coordinates: {
          lat: currentPosition.coords.latitude,
          lng: currentPosition.coords.longitude
        }
      });
    } catch (error) {
      console.log(error);

      if (!error.PERMISSION_DENIED) {
        showConfirmDialog({
          message:
            'We could not get your location, do you want to try again?',
          onConfirm: getCurrentPosition,
          onCancel: () => {
            updateState({ status: 'failed' });
          }
        });
      }
    }
  }, [updateState]);

  const askPermission = React.useCallback(async () => {
    if (status !== 'initial') return;
    updateState({ status: 'requesting' });
    const results = await request(permission);

    if (results === 'granted') {
      updateState({ status: 'granted' });
      getCurrentPosition();
    } else {
      updateState({ status: 'denied' });
    }
  }, [status, updateState, getCurrentPosition]);

  React.useEffect(() => {
    if (status === 'initial' && shouldAsk) askPermission();
  }, [status, askPermission, shouldAsk]);

  useAppStateEffect({
    onActive: askPermission
  });

  return {
    askPermission,
    getCurrentPosition,
    status,
    coordinates
  };
}

export default useUserLocation;
