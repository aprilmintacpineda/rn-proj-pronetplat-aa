import React from 'react';
import { FormContext } from 'components/FormWithContext';
import SelectOptions from 'components/FormWithContext/SelectOptions';
import SubmitButton from 'components/FormWithContext/SubmitButton';
import TextInput from 'components/FormWithContext/TextInput';

const unitOptions = ['kilometers', 'miles'];
const maxDistanceOptions = [
  25, 50, 100, 150, 200, 250, 300, 350, 400, 450, 500
];

function FilterForm ({ onSave, unit, maxDistance, search }) {
  const { setForm } = React.useContext(FormContext);

  React.useEffect(() => {
    setForm({
      formValues: { unit, maxDistance, search },
      formContext: { onSave }
    });
  }, [setForm, onSave, unit, maxDistance, search]);

  return (
    <>
      <TextInput
        field="search"
        label="search"
        labelSuffix="(optional)"
      />
      <SelectOptions field="unit" options={unitOptions} />
      <SelectOptions
        field="maxDistance"
        options={maxDistanceOptions}
      />
      <SubmitButton>Apply filters</SubmitButton>
    </>
  );
}

export default React.memo(FilterForm);
