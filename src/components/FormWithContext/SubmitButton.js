import React from 'react';
import { FormContext } from '.';
import Button from 'components/Button';

function SubmitButton ({
  children,
  disabled: disabedFromProps = false,
  disableOnEmptyFields,
  ...btnProps
}) {
  const { submitHandler, disabled, formValues } =
    React.useContext(FormContext);

  const isDisabled = React.useMemo(() => {
    if (disableOnEmptyFields) {
      return Boolean(
        disableOnEmptyFields.find(field => !formValues[field])
      );
    }

    return false;
  }, [disableOnEmptyFields, formValues]);

  return (
    <Button
      onPress={submitHandler}
      mode="contained"
      loading={disabled}
      disabled={isDisabled || disabedFromProps}
      {...btnProps}
    >
      {children}
    </Button>
  );
}

export default React.memo(SubmitButton);
