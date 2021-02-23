import React from 'react';
import { FormContext } from 'components/FormWithContext/index';
import Select from 'components/SelectOptions';
import { camelToTitleCase } from 'libs/strings';

function SelectOptions ({ field, ...selectProps }) {
  const {
    onChangeHandlers,
    formValues,
    formErrors,
    disabled
  } = React.useContext(FormContext);

  return (
    <Select
      disabled={disabled}
      label={camelToTitleCase(field)}
      error={formErrors[field]}
      value={formValues[field]}
      onChange={onChangeHandlers[field]}
      {...selectProps}
    />
  );
}

export default React.memo(SelectOptions);
