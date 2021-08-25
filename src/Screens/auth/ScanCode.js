import { useIsFocused } from '@react-navigation/native';
import React from 'react';
import { Linking } from 'react-native';
import { Camera } from 'react-native-camera-kit';
import { Text } from 'react-native-paper';
import Button from 'components/Button';
import CenteredSurface from 'components/CenteredSurface';
import useCameraPermission from 'hooks/useCameraPermissions';
import { logEvent } from 'libs/logging';
import { sendContactRequest } from 'libs/user';
import { paperTheme } from 'theme';

function onReadCode (event) {
  try {
    const targetUser = JSON.parse(event.nativeEvent.codeStringValue);
    sendContactRequest(targetUser);
  } catch (error) {
    logEvent('onReadCodeError', {
      errorMessage: error.message
    });

    console.log(error);
  }
}

function openSettings () {
  Linking.openSettings();
}

function ScanCode () {
  const isFocused = useIsFocused();
  const { status } = useCameraPermission({ shouldAsk: isFocused });

  if (isFocused) {
    if (status === 'granted') {
      return (
        <Camera
          style={{ flex: 1, backgroundColor: '#000' }}
          flashMode="off"
          focusMode="on"
          zoomMode="off"
          torchMode="off"
          scanBarcode
          onReadCode={onReadCode}
          saveToCameraRoll={false}
          showFrame
          laserColor={paperTheme.colors.error}
          frameColor={paperTheme.colors.error}
        />
      );
    }

    if (status === 'denied') {
      return (
        <CenteredSurface>
          <Text style={{ marginBottom: 15 }}>
            You need to give the app permissions to use the camera to
            be able to scan QR codes of your contacts.
          </Text>
          <Button mode="contained" onPress={openSettings}>
            Open Settings
          </Button>
        </CenteredSurface>
      );
    }
  }

  return null;
}

export default React.memo(ScanCode);
