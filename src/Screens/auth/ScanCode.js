import { store, updateStore } from 'fluxible-js';
import React from 'react';
import { CameraKitCamera } from 'react-native-camera-kit';
import { Button, Text } from 'react-native-paper';

import { openSettings } from 'react-native-permissions';
import CenteredSurface from 'components/CenteredSurface';
import { addToContact } from 'helpers/contact';
import useCameraPermission from 'hooks/useCameraPermissions';

function addToPendingContactRequests (event) {
  const targetUser = JSON.parse(event.nativeEvent.codeStringValue);

  if (targetUser.id === store.authUser.id) return;

  const pendingContactRequest = store.pendingContactRequests.find(
    ({ id }) => targetUser.id === id
  );

  if (pendingContactRequest) {
    if (pendingContactRequest.status === 'error') addToContact(pendingContactRequest);
    return;
  }

  updateStore({
    pendingContactRequests: store.pendingContactRequests.concat({
      ...targetUser,
      status: 'initial'
    })
  });
}

function ScanCode () {
  const { isAllowed, isDoneChecking } = useCameraPermission();

  if (!isAllowed || !isDoneChecking) {
    return (
      <CenteredSurface>
        <Text style={{ marginBottom: 15 }}>
          You need to give the app permissions to use the camera to be able to scan QR
          codes of your contacts.
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
      onReadCode={addToPendingContactRequests}
      hideControls
      saveToCameraRoll={false}
    />
  );
}

export default React.memo(ScanCode);
