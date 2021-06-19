import { useIsFocused } from '@react-navigation/native';
import React from 'react';
import { Linking, View } from 'react-native';
import { Camera } from 'react-native-camera-kit';
import { ActivityIndicator, Text } from 'react-native-paper';
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
  const { isAllowed, isDoneChecking } = useCameraPermission({
    shouldAsk: isFocused
  });

  if (!isFocused) return null;

  if (!isAllowed) {
    if (!isDoneChecking) {
      return (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <ActivityIndicator color={paperTheme.colors.primary} />
        </View>
      );
    }

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
