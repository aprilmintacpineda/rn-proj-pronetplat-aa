import React from 'react';
import SendResetCodeForm from './SendResetCodeForm';
import FormWithContext from 'components/FormWithContext';
import { unknownError } from 'libs/alerts';
import validate from 'libs/validate';

const formOptions = {
  initialFormValues: {
    email: ''
  },
  validators: {
    email: ({ email }) => validate(email, ['required', 'email'])
  },
  endPoint: '/forgot-password',
  onSubmitError: unknownError,
  ignoreResponse: true
};

function SendResetCode ({ onResetCodeSent }) {
  return (
    <FormWithContext formOptions={formOptions}>
      <SendResetCodeForm onResetCodeSent={onResetCodeSent} />
    </FormWithContext>
  );
}

export default React.memo(SendResetCode);
