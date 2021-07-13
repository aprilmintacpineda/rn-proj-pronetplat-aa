import {
  launchCameraAsync,
  launchImageLibraryAsync
} from 'expo-image-picker';
import React from 'react';
import { Platform, View } from 'react-native';
import { Text, TouchableRipple } from 'react-native-paper';
import {
  openSettings,
  PERMISSIONS,
  request
} from 'react-native-permissions';
import Modalize from './Modalize';
import RNVectorIcon from 'components/RNVectorIcon';
import { showErrorPopup } from 'fluxible/actions/popup';
import { logEvent } from 'libs/logging';
import { paperTheme } from 'theme';

const cameraPermission = Platform.select({
  ios: PERMISSIONS.IOS.CAMERA,
  android: PERMISSIONS.ANDROID.CAMERA
});

const galeryPermission = Platform.select({
  ios: PERMISSIONS.IOS.PHOTO_LIBRARY,
  android: PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE
});

function ImagePicker ({
  TriggerComponent,
  triggerComponentProps,
  onSelect
}) {
  const modalRef = React.useRef();

  const openUploadOptions = React.useCallback(() => {
    modalRef.current.open();
  }, []);

  const selectPicture = React.useCallback(async () => {
    const results = await request(galeryPermission);

    if (results !== 'granted') {
      modalRef.current.close();

      showErrorPopup({
        message: 'Please allow the app to use the photo library.',
        buttons: [
          {
            label: 'Open Settings',
            onPress: openSettings,
            color: paperTheme.colors.primary,
            mode: 'contained'
          }
        ]
      });

      return;
    }

    try {
      let uploadResult = launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7
      });

      modalRef.current.close();
      uploadResult = await uploadResult;
      if (uploadResult.cancelled) return;
      onSelect(uploadResult);
    } catch (error) {
      console.log('error', error);

      logEvent('selectPictureError', {
        message: error.message
      });
    }
  }, [onSelect]);

  const takePicture = React.useCallback(async () => {
    const results = await request(cameraPermission);

    if (results !== 'granted') {
      showErrorPopup({
        message: 'Please allow the app to use the camera.',
        buttons: [
          {
            label: 'Open Settings',
            onPress: openSettings,
            color: paperTheme.colors.primary,
            mode: 'contained'
          }
        ]
      });

      return;
    }

    try {
      let uploadResult = launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7
      });

      modalRef.current.close();
      uploadResult = await uploadResult;
      if (uploadResult.cancelled) return;
      onSelect(uploadResult);
    } catch (error) {
      console.log('error', error);

      logEvent('takePictureError', {
        message: error.message
      });
    }
  }, [onSelect]);

  return (
    <>
      <TriggerComponent
        {...triggerComponentProps}
        onPress={openUploadOptions}
      />
      <Modalize ref={modalRef}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-evenly'
          }}
        >
          <View
            style={{
              borderWidth: 1,
              borderColor: paperTheme.colors.primary,
              borderRadius: paperTheme.roundness
            }}
          >
            <TouchableRipple
              onPress={selectPicture}
              rippleColor={paperTheme.colors.rippleColor}
            >
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  margin: 15
                }}
              >
                <RNVectorIcon
                  provider="MaterialCommunityIcons"
                  name="file-upload"
                  size={40}
                  color={paperTheme.colors.primary}
                />
                <Text style={{ marginTop: 10 }}>
                  Select a picture
                </Text>
              </View>
            </TouchableRipple>
          </View>
          <View
            style={{
              borderWidth: 1,
              borderColor: paperTheme.colors.primary,
              borderRadius: paperTheme.roundness
            }}
          >
            <TouchableRipple
              onPress={takePicture}
              rippleColor={paperTheme.colors.rippleColor}
            >
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  margin: 15
                }}
              >
                <RNVectorIcon
                  provider="Ionicons"
                  name="ios-camera"
                  size={40}
                  color={paperTheme.colors.primary}
                />
                <Text style={{ marginTop: 10 }}>Take a picture</Text>
              </View>
            </TouchableRipple>
          </View>
        </View>
      </Modalize>
    </>
  );
}

export default React.memo(ImagePicker);
