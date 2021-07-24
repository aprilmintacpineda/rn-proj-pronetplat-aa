import React from 'react';
import Button from 'components/Button';

function TriggerComponent ({ status, onPress }) {
  const isUploading = status === 'uploading';

  return (
    <>
      <Button
        mode="contained"
        style={{ marginTop: 20 }}
        loading={isUploading}
        onPress={onPress}
      >
        Upload picture
      </Button>
    </>
  );
}

export default React.memo(TriggerComponent);
