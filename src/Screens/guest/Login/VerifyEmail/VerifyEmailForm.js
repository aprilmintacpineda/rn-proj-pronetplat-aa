import React from 'react';
import { ScrollView, View } from 'react-native';
import FormContainer from 'components/FormContainer';
import { FormContext } from 'components/FormWithContext';
import Button from 'components/FormWithContext/Button';
import SubmitButton from 'components/FormWithContext/SubmitButton';
import TextInput from 'components/FormWithContext/TextInput';
import useCountDown from 'hooks/useCountDown';
import LoginContext from 'root/Screens/guest/Login/LoginContext';

function VerifyEmailForm ({ onCancel, onVerified, onResendCode }) {
  const {
    responseData,
    isSubmitSuccess,
    resetForm,
    setContext,
    isTouched
  } = React.useContext(FormContext);
  const [isResending, setIsResending] = React.useState(false);
  const { page, emailCodeCanSendAt, authToken } = React.useContext(LoginContext);
  const { isDone, timeLeftStr } = useCountDown({ toTime: emailCodeCanSendAt });

  React.useEffect(() => {
    if (isSubmitSuccess) onVerified(responseData);
  }, [isSubmitSuccess, responseData, onVerified]);

  React.useEffect(() => {
    setContext({ authToken });
  }, [setContext, authToken]);

  React.useEffect(() => {
    if (page !== 2 && isTouched) resetForm();
  }, [page, isTouched, resetForm]);

  const resendCode = React.useCallback(async () => {
    if (isResending) return;
    setIsResending(true);
    await onResendCode();
    setIsResending(false);
  }, [isResending, onResendCode]);

  return (
    <ScrollView>
      <FormContainer>
        <TextInput field="verificationCode" type="code" />
        <SubmitButton style={{ marginBottom: 10 }} disabled={isResending}>
          Submit
        </SubmitButton>
        <Button onPress={onCancel} color="red" disabled={isResending}>
          Cancel
        </Button>
      </FormContainer>
      <View style={{ margin: 20 }}>
        <Button
          onPress={resendCode}
          loading={isResending}
          disabled={!isDone || isResending}>
          Resend Code {timeLeftStr}
        </Button>
      </View>
    </ScrollView>
  );
}

export default React.memo(VerifyEmailForm);
