import React from 'react';
import { FormContext } from '.';
import TextInputComponent from 'components/TextInput';
import { camelToTitleCase } from 'libs/strings';

function TextInput ({
  field,
  label: _label = null,
  labelSuffix,
  ...textInputProps
}) {
  const {
    formValues,
    formErrors,
    disabled,
    onChangeHandlers
  } = React.useContext(FormContext);

  const error = formErrors[field];
  const value = formValues[field];
  const onChange = onChangeHandlers[field];
  let label = _label || camelToTitleCase(field);

  if (labelSuffix) label += ` ${labelSuffix}`;

  return (
    <TextInputComponent
      error={error}
      value={value}
      disabled={disabled}
      label={label}
      onChangeText={onChange}
      {...textInputProps}
    />
  );
}

export default React.memo(TextInput);
