import { emitEvent } from 'fluxible-js';
import React from 'react';
import ContactDetailsAddForm from './ContactDetailsAddForm';
import FormWithContext from 'components/FormWithContext';
import {
  showRequestFailedPopup,
  showSuccessPopup
} from 'fluxible/actions/popup';
import validate from 'libs/validate';

const formOptions = {
  initialFormValues: {
    value: '',
    description: ''
  },
  validators: {
    value: ({ value }) =>
      validate(value, ['required', 'maxLength:255']),
    description: ({ description }) =>
      validate(description, ['required', 'maxLength:150'])
  },
  onSubmitSuccess: ({ responseData }) => {
    showSuccessPopup({
      message: 'Your contact detail has been added.'
    });

    emitEvent('contactDetailsAdded', responseData);
  },
  onSubmitError: showRequestFailedPopup,
  endPoint: '/contact-details-add',
  resetOnSuccess: true
};

function ContactDetailsAdd () {
  return (
    <FormWithContext formOptions={formOptions}>
      <ContactDetailsAddForm />
    </FormWithContext>
  );
}

export default React.memo(ContactDetailsAdd);
