import React from 'react';
import ChangePasswordForm from './ChangePasswordForm';
import { navigationRef } from 'App';
import FormWithContext from 'components/FormWithContext';
import { showSuccessPopup } from 'fluxible/actions/popup';
import validate from 'libs/validate';

const formOptions = {
  initialFormValues: {
    currentPassword: '',
    newPassword: '',
    retypeNewPassword: ''
  },
  validatorChains: {
    newPassword: ['retypeNewPassword'],
    retypeNewPassword: ['newPassword']
  },
  validators: {
    currentPassword: ({ currentPassword }) =>
      validate(currentPassword, ['required']),
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
  formErrorMessages: {
    403: {
      message:
        'The password you entered seems to be incorrect. Please try again.'
    }
  },
  onSubmitSuccess: () => {
    showSuccessPopup({
      message: 'You have successfully changed your password.'
    });

    navigationRef.current.goBack();
  },
  endPoint: 'change-password',
  ignoreResponse: true,
  stayDisabledOnSuccess: true
};

function ChangePassword () {
  return (
    <FormWithContext formOptions={formOptions}>
      <ChangePasswordForm />
    </FormWithContext>
  );
}

export default React.memo(ChangePassword);
