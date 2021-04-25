import React from 'react';
import { FormContext } from '.';
import CheckboxComponent from 'components/Checkbox';

function Checkbox ({ field, ...props }) {
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
      {...props}
      disableBuiltInState
      isChecked={value}
      onPress={onChange}
      disabled={disabled}
    />
  );
}

export default React.memo(Checkbox);
