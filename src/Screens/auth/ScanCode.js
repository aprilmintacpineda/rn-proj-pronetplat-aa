import React from 'react';
import { CameraKitCamera } from 'react-native-camera-kit';
import { Button, Text } from 'react-native-paper';
import { openSettings } from 'react-native-permissions';
import CenteredSurface from 'components/CenteredSurface';
import useCameraPermission from 'hooks/useCameraPermissions';
import { sendContactRequest } from 'libs/contact';

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
    <CameraKitCamera
      style={{ flex: 1, backgroundColor: '#000' }}
      cameraOptions={{
        flashMode: 'off',
        focusMode: 'on',
        zoomMode: 'off'
      }}
      resetFocusWhenMotionDetected
      scanBarcode
      onReadCode={onReadCode}
      hideControls
      saveToCameraRoll={false}
    />
  );
}

export default React.memo(ScanCode);
