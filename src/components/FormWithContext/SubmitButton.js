import React from 'react';
import { FormContext } from '.';
import Button from 'components/Button';

function SubmitButton ({
  children,
  disabled: disabedFromProps = false,
  ...btnProps
}) {
  const { submitHandler, disabled } = React.useContext(FormContext);

  return (
    <Button
      onPress={submitHandler}
      mode="contained"
      loading={disabled}
      disabled={disabedFromProps}
      {...btnProps}
    >
      {children}
    </Button>
  );
}

export default React.memo(SubmitButton);
