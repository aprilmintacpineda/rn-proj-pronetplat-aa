import React from 'react';
import { CameraKitCamera } from 'react-native-camera-kit';
import { Button, Text } from 'react-native-paper';

import { openSettings } from 'react-native-permissions';
import CenteredSurface from 'components/CenteredSurface';
import useCameraPermission from 'hooks/useCameraPermissions';

function ScanCode () {
  const { isAllowed, isDoneChecking } = useCameraPermission();

  const onReadCode = React.useCallback(event => {
    const { codeStringValue } = event.nativeEvent;
    console.log(codeStringValue);
  }, []);

  if (!isDoneChecking) return null;

  if (!isAllowed) {
    return (
      <CenteredSurface>
        <Text style={{ marginBottom: 15 }}>
          You need to give the app permissions to use the camera and microphone to start
          scanning QR codes.
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
