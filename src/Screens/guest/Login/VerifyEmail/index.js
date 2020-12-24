import React from 'react';
import VerifyEmailForm from './VerifyEmailForm';
import FormWithContext from 'components/FormWithContext';
import { unknownError } from 'fluxible/actions/popup';
import validate from 'libs/validate';

const formOptions = {
  initialFormValues: {
    verificationCode: ''
  },
  validators: {
    verificationCode: ({ verificationCode }) => validate(verificationCode, ['required'])
  },
  endPoint: '/verify-email',
  onSubmitError: unknownError
};

function VerifyEmail ({ onCancel, onVerified }) {
  return (
    <FormWithContext formOptions={formOptions}>
      <VerifyEmailForm onCancel={onCancel} onVerified={onVerified} />
    </FormWithContext>
  );
}

export default React.memo(VerifyEmail);
