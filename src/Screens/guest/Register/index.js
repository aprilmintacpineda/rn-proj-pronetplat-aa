import React from 'react';
import RegisterForm from './RegisterForm';
import { navigationRef } from 'App';
import FormWithContext from 'components/FormWithContext';
import { showSuccessPopup } from 'fluxible/actions/popup';
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
  transformInput: ({
    formValues: { retypePassword: _1, ...formValues }
  }) => formValues,
  onSubmitSuccess: async () => {
    logRegister();

    showSuccessPopup({
      message:
        "You're account will be created. Please wait for the email we sent you for further instructions."
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
