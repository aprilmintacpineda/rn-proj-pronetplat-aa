import React from 'react';
import Button from 'components/Button';

function TriggerComponent ({ status, disabled, onPress }) {
  return (
    <>
      <Button
        mode="contained"
        style={{ marginTop: 20 }}
        loading={status === 'uploading'}
        disabled={disabled}
        onPress={onPress}
      >
        Upload picture
      </Button>
    </>
  );
}

export default React.memo(TriggerComponent);
