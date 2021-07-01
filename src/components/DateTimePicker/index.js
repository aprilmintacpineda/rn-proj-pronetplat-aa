import { format } from 'date-fns';
import React from 'react';
import { View } from 'react-native';
import DateTimePickerForm from './DateTimePickerForm';
import FormWithContext from 'components/FormWithContext';
import Modalize from 'components/Modalize';
import TextInput from 'components/TextInput';
import { months, monthsIndexes } from 'libs/time';

const formOptions = {
  initialFormValues: () => {
    const currentDate = new Date();
    const hour = currentDate.getHours();

    return {
      month: months[currentDate.getMonth()],
      date: currentDate.getDate().toString(),
      year: currentDate.getFullYear().toString(),
      hour: (hour % 12).toString().padStart(2, '0'),
      minute: currentDate.getMinutes().toString().padStart(2, '0'),
      anteMeridiem: hour > 12 ? 'pm' : 'am'
    };
  },
  validators: {},
  initialFormContext: {
    onSave: null,
    askTime: false
  },
  onSubmit: ({
    formValues: { month, date, year, hour, minute },
    formContext: { askTime, onSave }
  }) => {
    const selectedDateTime = askTime
      ? new Date(year, monthsIndexes[month], date, hour, minute)
      : new Date(year, monthsIndexes[month], date);

    onSave(selectedDateTime);
  },
  ignoreResponse: true,
  stayDisabledOnSuccess: true
};

function DateTimePicker ({
  value,
  onChange,
  error,
  label,
  disabled,
  textInputProps,
  ...datePickerFormProps
}) {
  const modalizeRef = React.useRef(null);

  const openModal = React.useCallback(() => {
    modalizeRef.current.open();
  }, []);

  const onSave = React.useCallback(
    selectedDate => {
      modalizeRef.current.close();
      onChange(selectedDate);
    },
    [onChange]
  );

  return (
    <>
      <TextInput
        value={value ? format(new Date(value), "PP 'at' p") : ''}
        error={error}
        label={label}
        disabled={disabled}
        {...textInputProps}
        onPress={openModal}
      />
      <Modalize ref={modalizeRef}>
        <View
          style={{
            padding: 10
          }}
        >
          <FormWithContext formOptions={formOptions}>
            <DateTimePickerForm
              {...datePickerFormProps}
              onSave={onSave}
            />
          </FormWithContext>
        </View>
      </Modalize>
    </>
  );
}

export default React.memo(DateTimePicker);
