import iid from '@react-native-firebase/iid';
import {
  launchCameraAsync,
  launchImageLibraryAsync
} from 'expo-image-picker';
import { updateStore } from 'fluxible-js';
import React from 'react';
import { Platform, View } from 'react-native';
import { Modalize } from 'react-native-modalize';
import { Portal, Text, TouchableRipple } from 'react-native-paper';
import {
  openSettings,
  PERMISSIONS,
  requestMultiple
} from 'react-native-permissions';
import File from 'classes/File';
import RNVectorIcon from 'components/RNVectorIcon';
import {
  showErrorPopup,
  showRequestFailedPopup
} from 'fluxible/actions/popup';
import validate from 'libs/validate';
import { uploadFileToSignedUrl, xhr } from 'libs/xhr';
import { paperTheme } from 'theme';

const cameraPermissions = Platform.select({
  ios: [PERMISSIONS.IOS.CAMERA],
  android: [PERMISSIONS.ANDROID.CAMERA]
});

const galeryPermissions = Platform.select({
  ios: [PERMISSIONS.IOS.PHOTO_LIBRARY],
  android: [PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE]
});

async function waitForPicture (url) {
  await new Promise(resolve => setTimeout(resolve, 3000));

  let isSuccess = false;
  let nextWaitTime = 500;

  do {
    try {
      await fetch(url, { method: 'head' });
      isSuccess = true;
    } catch (error) {
      nextWaitTime += 500;

      await new Promise(resolve =>
        setTimeout(resolve, nextWaitTime)
      );
    }
  } while (!isSuccess);

  return true;
}

function ChangeProfilePicture ({
  TriggerComponent,
  triggerComponentProps
}) {
  const modalRef = React.useRef();
  const [isDisabled, setIsDisabled] = React.useState(false);

  const openUploadOptions = React.useCallback(() => {
    modalRef.current.open();
  }, []);

  const uploadPicture = React.useCallback(async picture => {
    try {
      setIsDisabled(true);

      const file = new File(picture);
      await file.getSize();

      if (file.size >= 5) {
        showErrorPopup({
          message: 'File must be less than 5mb.'
        });

        return;
      }

      if (
        validate(file.mimeType, ['options:image/jpeg,image/png'])
      ) {
        showErrorPopup({
          message: 'Please select only JPG or PNG images.'
        });

        return;
      }

      let response = await xhr('/change-profile-picture', {
        method: 'post',
        body: {
          mimeType: file.mimeType
        }
      });

      const { signedUrl, profilePicture } = await response.json();

      await uploadFileToSignedUrl({
        signedUrl,
        file
      });

      await waitForPicture(profilePicture);
      const deviceToken = await iid().getToken();

      response = await xhr('/validate-auth', {
        method: 'post',
        body: { deviceToken }
      });

      const { userData, authToken } = await response.json();

      updateStore({
        authUser: userData,
        authToken
      });
    } catch (error) {
      console.log(error);
      showRequestFailedPopup();
    } finally {
      setIsDisabled(false);
    }
  }, []);

  const selectPicture = React.useCallback(async () => {
    const results = await requestMultiple(galeryPermissions);

    const wasAllowed = !Object.keys(results).find(
      permission => results[permission].toLowerCase() !== 'granted'
    );

    if (!wasAllowed) {
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
        aspect: [4, 4],
        quality: 0.8
      });

      modalRef.current.close();
      uploadResult = await uploadResult;
      if (uploadResult.cancelled) return;
      uploadPicture(uploadResult);
    } catch (error) {
      console.log('error', error);
    }
  }, [uploadPicture]);

  const takePicture = React.useCallback(async () => {
    const results = await requestMultiple(cameraPermissions);

    const wasAllowed = !Object.keys(results).find(
      permission => results[permission].toLowerCase() !== 'granted'
    );

    if (!wasAllowed) {
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
        aspect: [4, 4],
        quality: 0.8
      });

      modalRef.current.close();
      uploadResult = await uploadResult;
      if (uploadResult.cancelled) return;
      uploadPicture(uploadResult);
    } catch (error) {
      console.log('error', error);
    }
  }, [uploadPicture]);

  return (
    <>
      <TriggerComponent
        onPress={openUploadOptions}
        disabled={isDisabled}
        {...triggerComponentProps}
      />
      <Portal>
        <Modalize
          adjustToContentHeight
          ref={modalRef}
          handlePosition="inside"
        >
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-evenly',
              paddingVertical: 20,
              marginTop: 10
            }}
          >
            <TouchableRipple
              onPress={selectPicture}
              rippleColor={paperTheme.colors.primaryAccent}
            >
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: 15,
                  borderWidth: 1,
                  borderColor: paperTheme.colors.primary,
                  borderRadius: 4
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
            <TouchableRipple
              onPress={takePicture}
              rippleColor={paperTheme.colors.primaryAccent}
            >
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: 15,
                  borderWidth: 1,
                  borderColor: paperTheme.colors.primary,
                  borderRadius: 4
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
        </Modalize>
      </Portal>
    </>
  );
}

export default React.memo(ChangeProfilePicture);
