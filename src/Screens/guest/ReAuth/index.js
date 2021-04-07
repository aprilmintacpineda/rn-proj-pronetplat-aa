import React from 'react';
import AuthenticateForm from './AuthenticateForm';
import { navigationRef } from 'App';
import FormWithContext from 'components/FormWithContext';
import { reAuth } from 'fluxible/actions/user';
import validate from 'libs/validate';

const formOptions = {
  initialFormValues: {
    password: ''
  },
  validators: {
    password: ({ password }) =>
      validate(password, ['required', 'maxLength:30'])
  },
  endPoint: 're-auth',
  onSubmitSuccess: ({ responseData }) => {
    const { userData, authToken } = responseData;
    reAuth({ userData, authToken });
    navigationRef.current.navigate('LoggedInRoutes');
  },
  formErrorMessages: {
    403: {
      message:
        'The password you entered seems to be incorrect. Please try again.'
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
