import geolocation from '@react-native-community/geolocation';
import React from 'react';
import { Platform } from 'react-native';
import { PERMISSIONS, request } from 'react-native-permissions';
import useAppStateEffect from './useAppStateEffect';
import useState from './useState';
import { showConfirmDialog } from 'fluxible/actions/popup';

const permissions = Platform.select({
  ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
  android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
});

function useUserLocation ({ shouldAsk = true } = {}) {
  const {
    state: { status, currentPosition },
    updateState
  } = useState({
    status: 'initial',
    currentPosition: {
      coordinates: {
        lat: null,
        lng: null
      },
      status: 'initial'
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
        currentPosition: {
          coordinates: {
            lat: currentPosition.coords.latitude,
            lng: currentPosition.coords.longitude
          },
          status: 'success'
        }
      });
    } catch (error) {
      console.log(error);

      showConfirmDialog({
        message:
          'We could not get your location, do you want to try again?',
        onConfirm: getCurrentPosition,
        onCancel: () => {
          updateState(oldState => ({
            currentPosition: {
              ...oldState.currentPosition,
              status: 'failed'
            }
          }));
        }
      });
    }
  }, [updateState]);

  const askPermission = React.useCallback(async () => {
    if (status !== 'initial') return;
    updateState({ status: 'requesting' });
    const results = await request(permissions);

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
    currentPosition
  };
}

export default useUserLocation;
