import React from 'react';
import { Button as RNPButton } from 'react-native-paper';
import { FormContext } from '.';

function SubmitButton ({ children, ...btnProps }) {
  const { submitHandler, disabled } = React.useContext(FormContext);

  return (
    <RNPButton onPress={submitHandler} disabled={disabled} mode="contained" {...btnProps}>
      {children}
    </RNPButton>
  );
}

export default React.memo(SubmitButton);
