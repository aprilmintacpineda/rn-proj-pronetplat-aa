import { updateStore } from 'fluxible-js';
import React from 'react';
import ImagePicker from './ImagePicker';
import File from 'classes/File';
import {
  showErrorPopup,
  showRequestFailedPopup
} from 'fluxible/actions/popup';
import { logEvent } from 'libs/logging';
import validate from 'libs/validate';
import {
  uploadFileToSignedUrl,
  waitForPicture,
  xhr
} from 'libs/xhr';

function ChangeProfilePictureWidget ({
  TriggerComponent,
  triggerComponentProps,
  onSuccess,
  firstSetup = false
}) {
  const [status, setStatus] = React.useState('initial');

  const resetStatus = React.useCallback(() => {
    setStatus('initial');
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

  return (
    <ImagePicker
      TriggerComponent={TriggerComponent}
      triggerComponentProps={{
        resetStatus,
        status,
        ...triggerComponentProps
      }}
      onSelect={uploadPicture}
    />
  );
}

export default React.memo(ChangeProfilePictureWidget);
