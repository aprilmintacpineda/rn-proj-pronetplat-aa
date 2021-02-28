import { useIsFocused } from '@react-navigation/native';
import React from 'react';
import { Camera } from 'react-native-camera-kit';
import { Button, Text } from 'react-native-paper';
import { openSettings } from 'react-native-permissions';
import CenteredSurface from 'components/CenteredSurface';
import useCameraPermission from 'hooks/useCameraPermissions';
import { sendContactRequest } from 'libs/user';

function onReadCode (event) {
  try {
    const targetUser = JSON.parse(event.nativeEvent.codeStringValue);
    sendContactRequest(targetUser);
  } catch (error) {
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

  return (
    <Camera
      style={{ flex: 1, backgroundColor: '#000' }}
      flashMode="off"
      focusMode="off"
      zoomMode="off"
      torchMode="off"
      scanBarcode={isFocused}
      onReadCode={onReadCode}
      saveToCameraRoll={false}
    />
  );
}

export default React.memo(ScanCode);
