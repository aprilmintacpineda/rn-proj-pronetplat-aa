import React from 'react';
import VerifyEmailForm from './VerifyEmailForm';
import FormWithContext from 'components/FormWithContext';
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
  formErrorMessage: error => {
    switch (error.status) {
      case 410:
        return {
          message:
            'Your verification code has already expired. You can request a new one by tapping on resend code button.'
        };
      case 403:
        return {
          message: 'Incorrect verification code.'
        };
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
