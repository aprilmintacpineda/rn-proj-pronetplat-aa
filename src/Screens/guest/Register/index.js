import React from 'react';
import RegisterForm from './RegisterForm';
import FormWithContext from 'components/FormWithContext';
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
      validate(password, ['required', `matches:${retypePassword},passwords`]),
    retypePassword: ({ retypePassword, password }) =>
      validate(retypePassword, ['required', `matches:${password},passwords`])
  },
  endPoint: '/register',
  onSubmitError: unknownError
};

function Register () {
  return (
    <FormWithContext formOptions={formOptions}>
      <RegisterForm />
    </FormWithContext>
  );
}

export default React.memo(Register);
