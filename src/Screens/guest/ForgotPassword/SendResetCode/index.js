import React from 'react';
import SendResetCodeForm from './SendResetCodeForm';
import FormWithContext from 'components/FormWithContext';
import validate from 'libs/validate';

const formOptions = {
  initialFormValues: {
    email: ''
  },
  validators: {
    email: ({ email }) => validate(email, ['required', 'email'])
  },
  endPoint: 'forgot-password-send',
  ignoreResponse: true,
  stayDisabledOnSuccess: true
};

function SendResetCode (props) {
  return (
    <FormWithContext formOptions={formOptions}>
      <SendResetCodeForm {...props} />
    </FormWithContext>
  );
}

export default React.memo(SendResetCode);
