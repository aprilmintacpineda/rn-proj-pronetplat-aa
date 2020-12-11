import React from 'react';
import { FormContext } from '.';
import RNPTextInput from 'components/TextInput';

import { camelToTitleCase } from 'libs/strings';

function TextInput ({ field, labelSuffix, ...textInputProps }) {
  const { formValues, formErrors, disabled, onChangeHandlers } = React.useContext(
    FormContext
  );

  const error = formErrors[field];
  const value = formValues[field];
  const onChange = onChangeHandlers[field];
  let label = camelToTitleCase(field);

  if (labelSuffix) label += ` ${labelSuffix}`;

  return (
    <RNPTextInput
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
