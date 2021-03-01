import React from 'react';
import RegisterForm from './RegisterForm';
import { navigationRef } from 'App';
import FormWithContext from 'components/FormWithContext';
import {
  showRequestFailedPopup,
  showSuccessPopup
} from 'fluxible/actions/popup';
import { logRegister } from 'libs/logging';
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
      validate(password, [
        'required',
        'password',
        `matches:${retypePassword},passwords`
      ]),
    retypePassword: ({ retypePassword, password }) =>
      validate(retypePassword, [
        'required',
        `matches:${password},passwords`
      ])
  },
  ignoreResponse: true,
  endPoint: 'register',
  onSubmitError: showRequestFailedPopup,
  transformInput: ({
    formValues: { retypePassword: _1, ...formValues }
  }) => formValues,
  onSubmitSuccess: async () => {
    logRegister();

    showSuccessPopup({
      message:
        "You're account has been created. Please check your inbox for the confirmation code that you need to verify your email"
    });

    navigationRef.current.navigate('Login');
  }
};

function Register (props) {
  return (
    <FormWithContext formOptions={formOptions}>
      <RegisterForm {...props} />
    </FormWithContext>
  );
}

export default React.memo(Register);
