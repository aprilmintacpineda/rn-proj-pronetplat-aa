import React from 'react';
import { ScrollView } from 'react-native';
import FormContainer from 'components/FormContainer';
import { FormContext } from 'components/FormWithContext';
import Button from 'components/FormWithContext/Button';
import SubmitButton from 'components/FormWithContext/SubmitButton';
import TextInput from 'components/FormWithContext/TextInput';
import PasswordStrength from 'components/PasswordStrength';

function RegisterForm () {
  const {
    formValues: { password }
  } = React.useContext(FormContext);

  return (
    <ScrollView>
      <FormContainer>
        <TextInput field="email" type="email" />
        <TextInput field="password" type="password" />
        <PasswordStrength value={password} />
        <TextInput
          style={{ marginTop: 15 }}
          field="retypePassword"
          type="password"
        />
        <SubmitButton style={{ marginBottom: 20 }}>
          Create account
        </SubmitButton>
        <Button to="Login" color="red">
          Cancel
        </Button>
      </FormContainer>
    </ScrollView>
  );
}

export default React.memo(RegisterForm);
