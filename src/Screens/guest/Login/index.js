import { updateStore } from 'fluxible-js';
import React from 'react';
import LoginForm from './LoginForm';
import FormWithContext from 'components/FormWithContext';
import { unknownError } from 'libs/alerts';
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
  onSubmitSuccess: ({ data }) => {
    const { authUser, token } = data;

    updateStore({
      authUser,
      token
    });
  },
  onSubmitError: unknownError
};

function Login () {
  return (
    <FormWithContext formOptions={formOptions}>
      <LoginForm />
    </FormWithContext>
  );
}

export default React.memo(Login);
