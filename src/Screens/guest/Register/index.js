import React from 'react';
import RegisterForm from './RegisterForm';
import { navigationRef } from 'App';
import FormWithContext from 'components/FormWithContext';
import { showSuccessPopup } from 'fluxible/actions/popup';
import { unknownError } from 'libs/alerts';
import validate from 'libs/validate';

const formOptions = {
  initialFormValues: {
    email: '',
    password: '',
    retypePassword: ''
  },
  validatorChains: {
    password: ['retypePassword'],
    retypePassword: ['password']
  },
  validators: {
    email: ({ email }) => validate(email, ['required', 'email']),
    password: ({ password, retypePassword }) =>
      validate(password, ['required', 'password', `matches:${retypePassword},passwords`]),
    retypePassword: ({ retypePassword, password }) =>
      validate(retypePassword, ['required', `matches:${password},passwords`])
  },
  ignoreResponse: true,
  endPoint: '/register',
  onSubmitError: unknownError,
  onSubmitSuccess: () => {
    showSuccessPopup({
      message:
        'You\'re account has bee created. Please check your inbox for the confirmation code that you need to verify your email'
    });
    navigationRef.current.navigate('Login');
  }
};

function Register () {
  return (
    <FormWithContext formOptions={formOptions}>
      <RegisterForm />
    </FormWithContext>
  );
}

export default React.memo(Register);
