import React from 'react';
import AuthenticateForm from './AuthenticateForm';
import FormWithContext from 'components/FormWithContext';
import { showRequestFailedPopup } from 'fluxible/actions/popup';
import validate from 'libs/validate';

const formOptions = {
  initialFormValues: {
    email: '',
    password: ''
  },
  validators: {
    email: ({ email }) => validate(email, ['required', 'email']),
    password: ({ password }) => validate(password, ['required'])
  },
  endPoint: '/login',
  onSubmitError: showRequestFailedPopup
};

function Authenticate ({ onLogin }) {
  return (
    <FormWithContext formOptions={formOptions}>
      <AuthenticateForm onLogin={onLogin} />
    </FormWithContext>
  );
}

export default React.memo(Authenticate);
