import React from 'react';
import VerifyEmailForm from './VerifyEmailForm';
import FormWithContext from 'components/FormWithContext';
import {
  showErrorPopup,
  showRequestFailedPopup
} from 'fluxible/actions/popup';
import validate from 'libs/validate';
import { xhr } from 'libs/xhr';

const formOptions = {
  initialFormValues: {
    verificationCode: ''
  },
  validators: {
    verificationCode: ({ verificationCode }) =>
      validate(verificationCode, ['required', 'maxLength:20'])
  },
  onSubmitError: ({ error }) => {
    switch (error.status) {
      case 410:
        showErrorPopup({
          message:
            'Your verification code has already expired. You can request a new one by tapping on resend code button.'
        });
        break;
      case 403:
        showErrorPopup({
          message:
            "Couldn't not verify your account. Either the verification code you provide has expired or is incorrect."
        });
        break;
      default:
        showRequestFailedPopup();
    }
  },
  onSubmit: async ({ formValues, formContext: { authToken } }) => {
    const response = await xhr('/verify-email', {
      method: 'post',
      body: formValues,
      headers: {
        Authorization: `bearer ${authToken}`
      }
    });

    return response.json();
  },
  stayDisabledOnSuccess: true
};

function VerifyEmail (props) {
  return (
    <FormWithContext formOptions={formOptions}>
      <VerifyEmailForm {...props} />
    </FormWithContext>
  );
}

export default React.memo(VerifyEmail);
