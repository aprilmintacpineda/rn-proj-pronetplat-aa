import { emitEvent } from 'fluxible-js';
import React from 'react';
import TriggerComponent from './TriggerComponent';
import ImagePicker from 'components/ImagePicker';
import ResponsiveImageView from 'components/ResponsiveImageView';
import {
  uploadFileToSignedUrl,
  waitForPicture,
  xhr
} from 'libs/xhr';
import { paperTheme } from 'theme';

function CoverPicture ({ id, coverPicture, status: eventStatus }) {
  const [status, setStatus] = React.useState('initial');

  const resetStatus = React.useCallback(() => {
    setStatus('initial');
  }, []);

  const uploadPicture = React.useCallback(
    async file => {
      try {
        setStatus('uploading');

        const response = await xhr(
          `/change-event-cover-picture/${id}`,
          {
            method: 'post',
            body: {
              type: file.type
            }
          }
        );

        const { signedUrl, coverPicture } = await response.json();
        await uploadFileToSignedUrl({ signedUrl, file });
        await waitForPicture(coverPicture);
        emitEvent('changedEventCoverPicture', { id, coverPicture });
        setStatus('uploadSuccess');
      } catch (error) {
        console.log(error);
        setStatus('uploadError');
      }
    },
    [id]
  );

  return (
    <>
      <ResponsiveImageView
        uri={coverPicture}
        imageStyle={{
          borderTopLeftRadius: paperTheme.roundness,
          borderTopRightRadius: paperTheme.roundness
        }}
      />
      {eventStatus !== 'published' && (
        <ImagePicker
          noErrorMessage
          TriggerComponent={TriggerComponent}
          triggerComponentProps={{
            resetStatus,
            status
          }}
          onSelect={uploadPicture}
        />
      )}
    </>
  );
}

export default React.memo(CoverPicture);
