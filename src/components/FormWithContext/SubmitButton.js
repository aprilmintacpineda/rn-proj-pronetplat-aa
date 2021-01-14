import React from 'react';
import { Button as RNPButton } from 'react-native-paper';
import { FormContext } from '.';

function SubmitButton ({
  children,
  disabled: disabedFromProps = false,
  ...btnProps
}) {
  const { submitHandler, disabled } = React.useContext(FormContext);

  return (
    <RNPButton
      onPress={submitHandler}
      disabled={disabled || disabedFromProps}
      mode="contained"
      loading={disabled}
      {...btnProps}
    >
      {children}
    </RNPButton>
  );
}

export default React.memo(SubmitButton);
