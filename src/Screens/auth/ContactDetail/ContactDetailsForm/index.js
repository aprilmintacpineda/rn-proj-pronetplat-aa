import { emitEvent } from 'fluxible-js';
import React from 'react';
import Form from './Form';
import FormWithContext from 'components/FormWithContext';
import { showSuccessPopup } from 'fluxible/actions/popup';
import validate from 'libs/validate';

const formOptions = {
  initialFormValues: {
    value: '',
    description: '',
    type: 'email',
    isCloseFriendsOnly: false
  },
  validatorChains: {
    type: ['value']
  },
  validators: {
    isCloseFriendsOnly: ({ isCloseFriendsOnly }) =>
      validate(isCloseFriendsOnly, ['required', 'bool']),
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
      message: !targetId
        ? 'Your contact detail has been added.'
        : 'Your changes were saved.'
    });

    if (!targetId) emitEvent('contactDetailsAdded', responseData);
    else emitEvent('contactDetailsUpdated', responseData);
  },
  endPoint: 'contact-details/:targetId',
  resetOnSuccess: true
};

function ContactDetailsForm () {
  return (
    <FormWithContext formOptions={formOptions}>
      <Form />
    </FormWithContext>
  );
}

export default React.memo(ContactDetailsForm);
