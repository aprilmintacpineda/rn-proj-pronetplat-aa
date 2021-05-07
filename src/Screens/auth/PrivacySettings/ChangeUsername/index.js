import { updateStore } from 'fluxible-js';
import React from 'react';
import ChangeUsernameForm from './ChangeUsernameForm';
import FormWithContext from 'components/FormWithContext';
import { showSuccessPopup } from 'fluxible/actions/popup';
import validate from 'libs/validate';

const formOptions = {
  initialFormValues: {
    username: ''
  },
  validators: {
    username: ({ username }) =>
      validate(username, ['alphanumeric', 'maxLength:18'])
  },
  formErrorMessages: {
    409: {
      message: 'That username is already taken.'
    }
  },
  onSubmitSuccess: ({ responseData: { userData, authToken } }) => {
    showSuccessPopup({ message: 'Changes saved.' });
    updateStore({ authUser: userData, authToken });
  },
  endPoint: 'change-username'
};

function ChangeUsername () {
  return (
    <FormWithContext formOptions={formOptions}>
      <ChangeUsernameForm />
    </FormWithContext>
  );
}

export default React.memo(ChangeUsername);
