import React from 'react';
import SendResetCodeForm from './SendResetCodeForm';
import FormWithContext from 'components/FormWithContext';
import { showRequestFailedPopup } from 'fluxible/actions/popup';
import validate from 'libs/validate';

const formOptions = {
  initialFormValues: {
    email: ''
  },
  validators: {
    email: ({ email }) => validate(email, ['required', 'email'])
  },
  endPoint: 'forgot-password-send',
  onSubmitError: showRequestFailedPopup,
  ignoreResponse: true
};

function SendResetCode (props) {
  return (
    <FormWithContext formOptions={formOptions}>
      <SendResetCodeForm {...props} />
    </FormWithContext>
  );
}

export default React.memo(SendResetCode);
