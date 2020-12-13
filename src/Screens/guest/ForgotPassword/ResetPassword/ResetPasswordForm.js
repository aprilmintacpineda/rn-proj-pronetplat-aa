import React from 'react';
import { ScrollView } from 'react-native';
import { Caption } from 'react-native-paper';
import FormContainer from 'components/FormContainer';
import { FormContext } from 'components/FormWithContext';
import Button from 'components/FormWithContext/Button';
import SubmitButton from 'components/FormWithContext/SubmitButton';
import TextInput from 'components/FormWithContext/TextInput';

function ResetPasswordForm ({ email }) {
  const { setContext } = React.useContext(FormContext);

  React.useEffect(() => {
    setContext(email);
  }, [setContext, email]);

  return (
    <ScrollView>
      <FormContainer>
        <Caption style={{ marginBottom: 20 }}>
          We have sent the confirmation code to your email. Please do not share that
          confirmation code with anyone.
        </Caption>
        <TextInput field="confirmationCode" />
        <TextInput field="newPassword" type="password" />
        <TextInput field="retypeNewPassword" type="password" />
        <SubmitButton style={{ marginBottom: 20 }}>Reset password</SubmitButton>
        <Button to="Login" color="red">
          Cancel
        </Button>
      </FormContainer>
    </ScrollView>
  );
}

export default React.memo(ResetPasswordForm);
