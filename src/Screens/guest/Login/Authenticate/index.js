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
    password: ({ password }) =>
      validate(password, ['required', 'maxLength:30'])
  },
  endPoint: '/login',
  onSubmitError: () => {
    showRequestFailedPopup({
      message: 'Inccorect email/password combination.'
    });
  },
  stayDisabledOnSuccess: true
};

function Authenticate (props) {
  return (
    <FormWithContext formOptions={formOptions}>
      <AuthenticateForm {...props} />
    </FormWithContext>
  );
}

export default React.memo(Authenticate);
