import { useIsFocused } from '@react-navigation/native';
import React from 'react';
import { Camera } from 'react-native-camera-kit';
import { Button, Text } from 'react-native-paper';
import { openSettings } from 'react-native-permissions';
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

function ScanCode () {
  const { isAllowed, isDoneChecking } = useCameraPermission();
  const isFocused = useIsFocused();

  if (!isAllowed || !isDoneChecking) {
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

  if (!isFocused) return null;

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

export default React.memo(ScanCode);
