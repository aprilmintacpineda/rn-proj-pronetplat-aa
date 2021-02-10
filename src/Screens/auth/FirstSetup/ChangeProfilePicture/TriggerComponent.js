import React from 'react';
import Button from 'components/Button';
import RNVectorIcon from 'components/RNVectorIcon';

function editIcon (props) {
  return (
    <RNVectorIcon provider="Ionicons" name="ios-pencil" {...props} />
  );
}

function TriggerComponent ({ onDone, ...btnProps }) {
  return (
    <>
      <Button
        mode="contained"
        style={{ marginTop: 20 }}
        icon={editIcon}
        {...btnProps}
      >
        Change
      </Button>
      <Button onPress={onDone} style={{ marginTop: 10 }}>
        Continue
      </Button>
    </>
  );
}

export default React.memo(TriggerComponent);
