import React from 'react';
import { ScrollView, View } from 'react-native';
import { FormContext } from 'components/FormWithContext';
import Button from 'components/FormWithContext/Button';
import SubmitButton from 'components/FormWithContext/SubmitButton';
import TextInput from 'components/FormWithContext/TextInput';
import LoginContext from 'root/Screens/guest/Login/LoginContext';

function VerifyEmailForm ({ onVerified, onResendCode }) {
  const {
    responseData,
    isSubmitSuccess,
    resetForm,
    setContext,
    isTouched
  } = React.useContext(FormContext);
  const [isResending, setIsResending] = React.useState(false);
  const { page, emailCodeCanSendAt, authToken } = React.useContext(
    LoginContext
  );

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
      <View style={{ margin: 20 }}>
        <TextInput field="verificationCode" type="code" />
        <SubmitButton
          style={{ marginBottom: 10 }}
          disabled={isResending}
        >
          Submit
        </SubmitButton>
        <View style={{ margin: 20 }}>
          <Button
            onPress={resendCode}
            loading={isResending}
            disabled={isResending}
            countDown={{
              toTime: emailCodeCanSendAt
            }}
          >
            {({ timeLeftStr }) => `Resend Code ${timeLeftStr}`}
          </Button>
        </View>
      </View>
    </ScrollView>
  );
}

export default React.memo(VerifyEmailForm);
