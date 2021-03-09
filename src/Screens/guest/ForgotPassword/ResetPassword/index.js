import React from 'react';
import ResetPasswordForm from './ResetPasswordForm';
import { navigationRef } from 'App';
import FormWithContext from 'components/FormWithContext';
import { showSuccessPopup } from 'fluxible/actions/popup';
import validate from 'libs/validate';

const formOptions = {
  initialFormValues: {
    confirmationCode: '',
    newPassword: '',
    retypeNewPassword: ''
  },
  initialFormContext: {
    email: null
  },
  validatorChains: {
    newPassword: ['retypeNewPassword'],
    retypeNewPassword: ['newPassword']
  },
  validators: {
    confirmationCode: ({ confirmationCode }) =>
      validate(confirmationCode, ['required', 'maxLength:20']),
    newPassword: ({ newPassword, retypeNewPassword }) =>
      validate(newPassword, [
        'required',
        'password',
        `matches:${retypeNewPassword},passwords`
      ]),
    retypeNewPassword: ({ retypeNewPassword, newPassword }) =>
      validate(retypeNewPassword, [
        'required',
        `matches:${newPassword},passwords`
      ])
  },
  transformInput: ({ formValues, formContext }) => {
    const { email } = formContext;

    return {
      ...formValues,
      email
    };
  },
  ignoreResponse: true,
  endPoint: 'forgot-password-confirm',
  onSubmitSuccess: () => {
    showSuccessPopup({
      message:
        'You have successfully reset your password. You may now login using your new password.'
    });
    navigationRef.current.navigate('Login');
  }
};

function ResetPassword (props) {
  return (
    <FormWithContext formOptions={formOptions}>
      <ResetPasswordForm {...props} />
    </FormWithContext>
  );
}

export default React.memo(ResetPassword);
