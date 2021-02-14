import React from 'react';
import AuthenticateForm from './AuthenticateForm';
import FormWithContext from 'components/FormWithContext';
import {
  showErrorPopup,
  showRequestFailedPopup
} from 'fluxible/actions/popup';
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
  onSubmitError: ({ error }) => {
    if (error.status === 403) {
      showErrorPopup({
        message: 'Inccorect email/password combination.'
      });
    } else {
      showRequestFailedPopup();
    }
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
