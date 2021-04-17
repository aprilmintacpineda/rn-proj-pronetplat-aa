import React from 'react';
import { FormContext } from '.';
import CheckboxComponent from 'components/Checkbox';

function Checkbox ({ field, ...props }) {
  const {
    formValues,
    disabled,
    onChangeHandlers
  } = React.useContext(FormContext);

  return (
    <CheckboxComponent
      {...props}
      value={formValues[field]}
      onValueChange={onChangeHandlers[field]}
      disabled={disabled}
    />
  );
}

export default React.memo(Checkbox);
