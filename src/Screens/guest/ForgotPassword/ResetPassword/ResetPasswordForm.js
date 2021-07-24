import React from 'react';
import { ScrollView, View } from 'react-native';
import { Subheading, Text } from 'react-native-paper';
import { FormContext } from 'components/FormWithContext';
import Button from 'components/FormWithContext/Button';
import SubmitButton from 'components/FormWithContext/SubmitButton';
import TextInput from 'components/FormWithContext/TextInput';
import PasswordStrength from 'components/PasswordStrength';
import {
  showRequestFailedPopup,
  showSuccessPopup
} from 'fluxible/actions/popup';
import useState from 'hooks/useState';
import { logEvent } from 'libs/logging';
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

  const {
    formValues: { newPassword },
    setContext
  } = React.useContext(FormContext);

  const resendCode = React.useCallback(async () => {
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

      logEvent('resendCodeError', {
        message: error.message
      });
    } finally {
      updateState({ isResending: false });
    }
  }, [email, updateState]);

  React.useEffect(() => {
    setContext({ email });
  }, [setContext, email]);

  return (
    <ScrollView>
      <View style={{ margin: 20 }}>
        <Subheading style={{ marginBottom: 20 }}>
          We have sent the confirmation code to your email. Please do
          not share that confirmation code with anyone.
        </Subheading>
        <TextInput field="confirmationCode" type="code" />
        <PasswordStrength value={newPassword} />
        <TextInput field="newPassword" type="password" />
        <TextInput field="retypeNewPassword" type="password" />
        <SubmitButton
          style={{ marginBottom: 20 }}
          disabled={isResending}
        >
          Reset my password
        </SubmitButton>
        <Button to="Login" color="red" disabled={isResending}>
          Cancel
        </Button>
      </View>
      <View style={{ margin: 20, marginBottom: 50 }}>
        <Text style={{ textAlign: 'center', marginBottom: 20 }}>
          Did not get the password reset code?
        </Text>
        <Button
          onPress={resendCode}
          loading={isResending}
          countDown={{
            start: lastSent,
            duration
          }}
        >
          {({ timeLeftStr }) => `Resend code ${timeLeftStr}`}
        </Button>
      </View>
    </ScrollView>
  );
}

export default React.memo(ResetPasswordForm);
