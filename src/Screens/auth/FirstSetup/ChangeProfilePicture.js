import * as ImagePicker from 'expo-image-picker';
import React from 'react';
import { Platform, ScrollView, View } from 'react-native';
import { Modalize } from 'react-native-modalize';
import {
  Divider,
  Headline,
  Portal,
  Subheading,
  Text,
  TouchableRipple
} from 'react-native-paper';
import { openSettings, PERMISSIONS, requestMultiple } from 'react-native-permissions';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import File from 'classes/File';
import Button from 'components/Button';
import FormContainer from 'components/FormContainer';
import UserAvatar from 'components/UserAvatar';
import { showErrorPopup, showRequestFailedPopup } from 'fluxible/actions/popup';
import useState from 'hooks/useState';
import validate from 'libs/validate';
import { xhr, uploadFileToSignedUrl } from 'libs/xhr';
import { paperTheme } from 'theme';

const { primary, rippleColor } = paperTheme.colors;
const modalButtonWrapperStyles = {
  borderRadius: 100,
  margin: 10,
  borderWidth: 1,
  borderColor: 'transparent',
  overflow: 'hidden'
};
const modalButtonContainerStyles = {
  height: 100,
  width: 100,
  padding: 20,
  justifyContent: 'center',
  alignItems: 'center'
};
const modalButtonLabelStyles = { color: primary, fontWeight: 'bold' };

const cameraPermissions = Platform.select({
  ios: [PERMISSIONS.IOS.CAMERA],
  android: [PERMISSIONS.ANDROID.CAMERA]
});

const galeryPermissions = Platform.select({
  ios: [PERMISSIONS.IOS.PHOTO_LIBRARY],
  android: [PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE]
});

function ChangeProfilePicture ({ onDone }) {
  const modalRef = React.useRef();
  const {
    state: { isUploading, hasUploaded },
    updateState
  } = useState({
    isUploading: false,
    hasUploaded: false
  });

  const uploadPicture = React.useCallback(
    async picture => {
      try {
        updateState({ isUploading: true });
        const file = new File(picture);

        if (validate(file.mimeType, ['options:image/jpeg,image/png'])) {
          showErrorPopup({ message: 'Please select only JPG or PNG images.' });
          return;
        }

        const response = await xhr('/change-profile-picture', {
          method: 'post',
          body: {
            mimeType: file.mimeType
          }
        });

        const { signedUrl } = await response.json();

        await uploadFileToSignedUrl({
          signedUrl,
          file
        });
      } catch (error) {
        console.log(error);
        showRequestFailedPopup();
        console.log(await error.text());
      } finally {
        updateState({ isUploading: false });
      }
    },
    [updateState]
  );

  const changeProfile = React.useCallback(async () => {
    modalRef.current.open();
  }, []);

  const openGalery = React.useCallback(async () => {
    const results = await requestMultiple(galeryPermissions);

    const wasAllowed = !Object.keys(results).find(
      permission => results[permission].toLowerCase() !== 'granted'
    );

    if (!wasAllowed) {
      modalRef.current.close();

      showErrorPopup({
        message: 'Please allow the app to use the media library.',
        buttons: [
          {
            label: 'Open Settings',
            onPress: openSettings,
            color: primary,
            mode: 'contained'
          }
        ]
      });

      return;
    }

    let result = ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 4],
      quality: 0.8
    });

    modalRef.current.close();
    result = await result;
    if (result.cancelled) return;
    uploadPicture(result);
  }, [uploadPicture]);

  const openCamera = React.useCallback(async () => {
    const results = await requestMultiple(cameraPermissions);

    const wasAllowed = !Object.keys(results).find(
      permission => results[permission].toLowerCase() !== 'granted'
    );

    console.log(wasAllowed);

    if (!wasAllowed) {
      modalRef.current.close();

      showErrorPopup({
        message: 'Please allow the app to use the camera.',
        buttons: [
          {
            label: 'Open Settings',
            onPress: openSettings,
            color: primary,
            mode: 'contained'
          }
        ]
      });

      return;
    }

    let result = ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 4],
      quality: 0.8
    });

    modalRef.current.close();
    result = await result;
    if (result.cancelled) return;
    uploadPicture(result);
  }, [uploadPicture]);

  return (
    <ScrollView>
      <FormContainer>
        <Headline>Setup your account</Headline>
        <Subheading>
          Add a profile picture to allow your network to recognize you easily.
        </Subheading>
        <Divider style={{ marginVertical: 20 }} />
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <UserAvatar size={150} />
        </View>
        <Button
          onPress={changeProfile}
          mode="contained"
          style={{ marginTop: 20 }}
          icon={props => <Ionicons name="ios-pencil" {...props} />}
          disabled={isUploading}>
          Change
        </Button>
      </FormContainer>
      <View style={{ margin: 20 }}>
        <Button onPress={onDone} disabled={isUploading}>
          {!hasUploaded ? 'Skip' : 'Done'}
        </Button>
      </View>
      <Portal>
        <Modalize ref={modalRef} adjustToContentHeight handlePosition="inside">
          <View
            style={{
              flexDirection: 'row',
              flex: 1,
              padding: 20,
              marginTop: 10,
              justifyContent: 'space-evenly',
              alignItems: 'center'
            }}>
            <View style={modalButtonWrapperStyles}>
              <TouchableRipple onPress={openGalery} rippleColor={rippleColor}>
                <View style={modalButtonContainerStyles}>
                  <AntDesign name="picture" size={35} color={primary} />
                  <Text style={modalButtonLabelStyles}>Galery</Text>
                </View>
              </TouchableRipple>
            </View>
            <View style={modalButtonWrapperStyles}>
              <TouchableRipple onPress={openCamera} rippleColor={rippleColor}>
                <View style={modalButtonContainerStyles}>
                  <Ionicons name="ios-camera-outline" size={35} color={primary} />
                  <Text style={modalButtonLabelStyles}>Camera</Text>
                </View>
              </TouchableRipple>
            </View>
          </View>
        </Modalize>
      </Portal>
    </ScrollView>
  );
}

export default React.memo(ChangeProfilePicture);
