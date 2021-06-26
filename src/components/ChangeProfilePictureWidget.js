import {
  launchCameraAsync,
  launchImageLibraryAsync
} from 'expo-image-picker';
import { updateStore } from 'fluxible-js';
import React from 'react';
import { Platform, View } from 'react-native';
import { Text, TouchableRipple } from 'react-native-paper';
import {
  openSettings,
  PERMISSIONS,
  request
} from 'react-native-permissions';
import Modalize from './Modalize';
import File from 'classes/File';
import RNVectorIcon from 'components/RNVectorIcon';
import {
  showErrorPopup,
  showRequestFailedPopup
} from 'fluxible/actions/popup';
import { logEvent } from 'libs/logging';
import { sleep } from 'libs/time';
import validate from 'libs/validate';
import { uploadFileToSignedUrl, xhr } from 'libs/xhr';
import { paperTheme } from 'theme';

const cameraPermission = Platform.select({
  ios: PERMISSIONS.IOS.CAMERA,
  android: PERMISSIONS.ANDROID.CAMERA
});

const galeryPermission = Platform.select({
  ios: PERMISSIONS.IOS.PHOTO_LIBRARY,
  android: PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE
});

async function waitForPicture (url) {
  // this wait time was derived from the time for
  // profilePictureUploaded function to complete
  // processing the new profile picture
  await sleep(2);
  let isSuccess = false;

  do {
    // this will wait for total of 3 seconds for
    // the first time
    await sleep(1);

    try {
      const response = await fetch(url, { method: 'head' });
      isSuccess = response.status === 200;
    } catch (error) {
      console.log('waitForPicture', error);
    }
  } while (!isSuccess);

  return true;
}

function ChangeProfilePicture ({
  TriggerComponent,
  triggerComponentProps,
  onSuccess,
  firstSetup = false
}) {
  const modalRef = React.useRef();
  const [status, setStatus] = React.useState('initial');

  const resetStatus = React.useCallback(() => {
    setStatus('initial');
  }, []);

  const openUploadOptions = React.useCallback(() => {
    modalRef.current.open();
  }, []);

  const uploadPicture = React.useCallback(
    async picture => {
      try {
        setStatus('uploading');

        const file = new File(picture);
        await file.getSize();

        if (file.size >= 5) {
          showErrorPopup({
            message: 'File must be less than 5mb.'
          });

          return;
        }

        if (validate(file.type, ['options:image/jpeg,image/png'])) {
          showErrorPopup({
            message: 'Please select only JPG or PNG images.'
          });

          return;
        }

        let response = await xhr('/change-profile-picture', {
          method: 'post',
          body: {
            type: file.type
          }
        });

        const { signedUrl, profilePicture } = await response.json();
        await uploadFileToSignedUrl({ signedUrl, file });
        await waitForPicture(profilePicture);

        const endPoint = firstSetup
          ? '/setup-complete'
          : '/validate-auth';

        response = await xhr(endPoint, { method: 'post' });
        const { userData, authToken } = await response.json();

        updateStore({
          authUser: userData,
          authToken
        });

        if (onSuccess) onSuccess();

        setStatus('uploadSuccess');
      } catch (error) {
        console.log(error);

        showRequestFailedPopup();
        setStatus('uploadFailed');

        logEvent('profilePictureUploadError', {
          message: error.message
        });
      }
    },
    [onSuccess, firstSetup]
  );

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
      uploadPicture(uploadResult);
    } catch (error) {
      console.log('error', error);

      logEvent('selectPictureError', {
        message: error.message
      });
    }
  }, [uploadPicture]);

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
      uploadPicture(uploadResult);
    } catch (error) {
      console.log('error', error);

      logEvent('takePictureError', {
        message: error.message
      });
    }
  }, [uploadPicture]);

  return (
    <>
      <TriggerComponent
        onPress={openUploadOptions}
        disabled={status === 'uploading'}
        status={status}
        resetStatus={resetStatus}
        {...triggerComponentProps}
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

export default React.memo(ChangeProfilePicture);
