import { emitEvent } from 'fluxible-js';
import React from 'react';
import Form from './Form';
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
      return validate(description, ['required', 'maxLength:100']);
    },
    type: ({ type }) => {
      return validate(type, [
        'required',
        'options:mobile,telephone,website,email'
      ]);
    }
  },
  onSubmitSuccess: ({ targetId, responseData }) => {
    showSuccessPopup({
      message: 'Your contact detail has been added.'
    });

    if (!targetId) emitEvent('contactDetailsAdded', responseData);
    else emitEvent('contactDetailsUpdated', responseData);
  },
  onSubmitError: showRequestFailedPopup,
  endPoint: 'contact-details/:targetId',
  resetOnSuccess: true
};

function ContactDetailsAdd () {
  return (
    <FormWithContext formOptions={formOptions}>
      <Form />
    </FormWithContext>
  );
}

export default React.memo(ContactDetailsAdd);
