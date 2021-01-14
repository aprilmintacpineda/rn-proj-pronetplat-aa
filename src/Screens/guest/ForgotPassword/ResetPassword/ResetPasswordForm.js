import React from 'react';
import { ScrollView, View } from 'react-native';
import { Text } from 'react-native-paper';
import Caption from 'components/Caption';
import FormContainer from 'components/FormContainer';
import { FormContext } from 'components/FormWithContext';
import Button from 'components/FormWithContext/Button';
import SubmitButton from 'components/FormWithContext/SubmitButton';
import TextInput from 'components/FormWithContext/TextInput';
import PasswordStrength from 'components/PasswordStrength';
import {
  showRequestFailedPopup,
  showSuccessPopup
} from 'fluxible/actions/popup';
import useCountDown from 'hooks/useCountDown';
import useState from 'hooks/useState';
import { xhr } from 'libs/xhr';

const duration = { minutes: 5 };

function ResetPasswordForm ({ email }) {
  const {
    state: { lastSent, isResending },
    updateState
  } = useState(() => ({
    lastSent: new Date(),
    isResending
  }));

  const { isDone, timeLeftStr } = useCountDown({
    start: lastSent,
    duration
  });

  const {
    formValues: { newPassword },
    setContext
  } = React.useContext(FormContext);

  const resendCode = React.useCallback(async () => {
    if (!isDone) return;

    try {
      updateState({ isResending: true });

      await xhr('/forgot-password-send', {
        method: 'post',
        body: {
          email,
          isResend: true
        }
      });

      showSuccessPopup({
        message:
          'We have sent your new confirmation code to your email.'
      });
      updateState({ lastSent: new Date() });
    } catch (error) {
      console.log(error);
      showRequestFailedPopup();
    } finally {
      updateState({ isResending: false });
    }
  }, [email, isDone, updateState]);

  React.useEffect(() => {
    setContext({ email });
  }, [setContext, email]);

  return (
    <ScrollView>
      <FormContainer>
        <Caption style={{ marginBottom: 20 }}>
          We have sent the confirmation code to your email. Please do
          not share that confirmation code with anyone.
        </Caption>
        <TextInput field="confirmationCode" type="code" />
        <TextInput field="newPassword" type="password" />
        <PasswordStrength value={newPassword} />
        <TextInput
          style={{ marginTop: 15 }}
          field="retypeNewPassword"
          type="password"
        />
        <SubmitButton
          style={{ marginBottom: 20 }}
          disabled={isResending}
        >
          Reset password
        </SubmitButton>
        <Button to="Login" color="red" disabled={isResending}>
          Cancel
        </Button>
      </FormContainer>
      <View style={{ margin: 20, marginBottom: 50 }}>
        <Text style={{ textAlign: 'center', marginBottom: 20 }}>
          Did not get the password reset code?
        </Text>
        <Button
          onPress={resendCode}
          disabled={isResending || !isDone}
          loading={isResending}
        >
          Resend code {timeLeftStr}
        </Button>
      </View>
    </ScrollView>
  );
}

export default React.memo(ResetPasswordForm);
