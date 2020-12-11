import React from 'react';
import RegisterForm from './RegisterForm';
import FormWithContext from 'components/FormWithContext';
import { unknownError } from 'libs/alerts';

const formOptions = {
  initialFormValues: {
    firstName: '',
    middleName: '',
    lastName: '',
    gender: '',
    email: '',
    password: '',
    retypePassword: ''
  },
  validatorChains: {},
  validators: {},
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
