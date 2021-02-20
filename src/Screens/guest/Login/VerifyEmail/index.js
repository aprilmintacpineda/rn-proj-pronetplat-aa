import React from 'react';
import VerifyEmailForm from './VerifyEmailForm';
import FormWithContext from 'components/FormWithContext';
import { showRequestFailedPopup } from 'fluxible/actions/popup';
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
    showRequestFailedPopup({
      message:
        error.status === 410
          ? 'Your verification code has already expired. You can request a new one by tapping on resend code button.'
          : error.status === 403
          ? "Couldn't not verify your account. Either the verification code you provide has expired or is incorrect."
          : undefined
    });
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
