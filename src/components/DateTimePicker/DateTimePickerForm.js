import React from 'react';
import { View } from 'react-native';
import { FormContext } from 'components/FormWithContext';
import Button from 'components/FormWithContext/Button';
import SelectOptions from 'components/FormWithContext/SelectOptions';
import SubmitButton from 'components/FormWithContext/SubmitButton';
import {
  anteMeridiem,
  hours,
  minutes,
  months,
  monthsIndexes
} from 'libs/time';

const yearOptions = [
  new Date().getFullYear().toString(),
  (new Date().getFullYear() + 1).toString()
];

function DateTimePickerForm ({ askTime = false, onSave }) {
  const { formValues, setContext } = React.useContext(FormContext);
  const [mode, setMode] = React.useState('date');

  React.useEffect(() => {
    setContext({ onSave, askTime });
  }, [setContext, onSave, askTime]);

  const next = React.useCallback(() => {
    setMode('time');
  }, []);

  const dateOptions = React.useMemo(() => {
    const maxDay = new Date(
      formValues.year,
      monthsIndexes[formValues.month],
      0
    ).getDate();

    return Array.from(Array(maxDay), (_, index) =>
      String(index + 1)
    );
  }, [formValues.year, formValues.month]);

  return (
    <>
      {mode === 'date' ? (
        <>
          <View
            style={{
              flexDirection: 'row',
              flex: 1
            }}
          >
            <SelectOptions
              field="month"
              options={months}
              viewProps={{ style: { flex: 1 } }}
            />
            <SelectOptions
              field="date"
              options={dateOptions}
              viewProps={{
                style: { flex: 0.5, paddingHorizontal: 10 }
              }}
            />
            <SelectOptions
              field="year"
              options={yearOptions}
              viewProps={{ style: { flex: 0.8 } }}
            />
          </View>
        </>
      ) : (
        <>
          <View
            style={{
              flexDirection: 'row',
              flex: 1
            }}
          >
            <SelectOptions
              field="hour"
              options={hours}
              viewProps={{ flex: 1, paddingRight: 2.5 }}
            />
            <SelectOptions
              field="minute"
              options={minutes}
              viewProps={{
                style: { flex: 1, paddingHorizontal: 2.5 }
              }}
            />
            <SelectOptions
              field="anteMeridiem"
              options={anteMeridiem}
              label="AM or PM"
              labelUpperCase
              viewProps={{
                style: { flex: 1, paddingLeft: 2.5 }
              }}
            />
          </View>
        </>
      )}
      {askTime && mode === 'date' ? (
        <Button onPress={next}>Next</Button>
      ) : (
        <SubmitButton>Set</SubmitButton>
      )}
    </>
  );
}

export default React.memo(DateTimePickerForm);
