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
    description: '',
    type: 'email'
  },
  validatorChains: {
    type: ['value']
  },
  validators: {
    value: ({ value, type }) => {
      switch (type) {
        case 'email':
          return validate(value, ['required', 'email']);
        case 'website':
          return validate(value, ['required', 'url']);
        default:
          return validate(value, [
            'required',
            'maxLength:255',
            'contactOther'
          ]);
      }
    },
    description: ({ description }) => {
      return validate(description, ['required', 'maxLength:150']);
    },
    type: ({ type }) => {
      return validate(type, [
        'required',
        'options:mobile,telephone,website,email'
      ]);
    }
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
