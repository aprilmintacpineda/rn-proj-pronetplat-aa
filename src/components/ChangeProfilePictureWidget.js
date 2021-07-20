import { updateStore } from 'fluxible-js';
import React from 'react';
import ImagePicker from './ImagePicker';
import { showRequestFailedPopup } from 'fluxible/actions/popup';
import { logEvent } from 'libs/logging';
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
    async file => {
      try {
        setStatus('uploading');

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
      hideErrorMessage
    />
  );
}

export default React.memo(ChangeProfilePictureWidget);
