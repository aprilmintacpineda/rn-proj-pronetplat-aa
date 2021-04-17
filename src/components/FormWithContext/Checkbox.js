import React from 'react';
import { FormContext } from '.';
import CheckboxComponent from 'components/Checkbox';

function Checkbox ({ field }) {
  const {
    formValues,
    disabled,
    onChangeHandlers
  } = React.useContext(FormContext);

  return (
    <CheckboxComponent
      value={formValues[field]}
      onValueChange={onChangeHandlers[field]}
      disabled={disabled}
    />
  );
}

export default React.memo(Checkbox);
