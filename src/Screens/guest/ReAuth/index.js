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
  formErrorMessage: () => ({
    message: 'Your password seems to be incorrect.'
  }),
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
