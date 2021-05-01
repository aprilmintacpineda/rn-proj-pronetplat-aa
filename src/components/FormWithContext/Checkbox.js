import React from 'react';
import { FormContext } from '.';
import CheckboxComponent from 'components/Checkbox';

function Checkbox ({ field, ...checkboxProps }) {
  const {
    formValues,
    disabled,
    onChangeHandlers
  } = React.useContext(FormContext);

  const value = formValues[field];
  const onChangeHandler = onChangeHandlers[field];

  const onChange = React.useCallback(() => {
    onChangeHandler(!value);
  }, [onChangeHandler, value]);

  return (
    <CheckboxComponent
      {...checkboxProps}
      value={value}
      onChange={onChange}
      disabled={disabled}
    />
  );
}

export default React.memo(Checkbox);
