import React from 'react';
import Form from './Form';
import FormWithContext from 'components/FormWithContext';

const formOptions = {
  initialFormValues: {
    search: '',
    unit: 'kilometers',
    maxDistance: 100
  },
  initialFormContext: {
    onSave: null
  },
  onSubmit: ({ formValues, formContext: { onSave } }) => {
    onSave(formValues);
  },
  ignoreResponse: true
};

function FilterForm (props) {
  return (
    <FormWithContext formOptions={formOptions}>
      <Form {...props} />
    </FormWithContext>
  );
}

export default React.memo(FilterForm);
