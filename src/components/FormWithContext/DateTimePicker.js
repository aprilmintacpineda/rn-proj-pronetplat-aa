import React from 'react';
import DateTimePickerComponent from 'components/DateTimePicker';
import { FormContext } from 'components/FormWithContext/index';
import { camelToTitleCase } from 'libs/strings';

function DateTimePicker ({ field, ...dateTimePickerProps }) {
  const { onChangeHandlers, formValues, formErrors, disabled } =
    React.useContext(FormContext);

  return (
    <DateTimePickerComponent
      disabled={disabled}
      label={camelToTitleCase(field)}
      error={formErrors[field]}
      value={formValues[field]}
      onChange={onChangeHandlers[field]}
      {...dateTimePickerProps}
    />
  );
}

export default React.memo(DateTimePicker);
