import React from 'react';
import ResetPasswordForm from './ResetPasswordForm';
import { navigationRef } from 'App';
import FormWithContext from 'components/FormWithContext';
import { showSuccessPopup } from 'fluxible/actions/popup';
import { unknownError } from 'libs/alerts';
import validate from 'libs/validate';

const formOptions = {
  initialFormValues: {
    confirmationCode: '',
    newPassword: '',
    retypeNewPassword: ''
  },
  initialFormContext: {
    email: true
  },
  validatorChains: {
    newPassword: ['retypeNewPassword'],
    retypeNewPassword: ['newPassword']
  },
  validators: {
    confirmationCode: ({ confirmationCode }) => validate(confirmationCode, ['required']),
    newPassword: ({ newPassword, retypeNewPassword }) =>
      validate(newPassword, ['required', `matches:${retypeNewPassword},passwords`]),
    retypeNewPassword: ({ retypeNewPassword, newPassword }) =>
      validate(retypeNewPassword, ['required', `matches:${newPassword},passwords`])
  },
  transformInput: ({ formValues, formContext }) => {
    const { email } = formContext;

    return {
      ...formValues,
      email
    };
  },
  ignoreResponse: true,
  endPoint: '/reset-password',
  onSubmitSuccess: () => {
    showSuccessPopup({
      message:
        'You have successfully reset your password. You may now login using your new password.'
    });
    navigationRef.current.navigate('Login');
  },
  onSubmitError: unknownError
};

function ResetPassword ({ email }) {
  return (
    <FormWithContext formOptions={formOptions}>
      <ResetPasswordForm email={email} />
    </FormWithContext>
  );
}

export default React.memo(ResetPassword);
