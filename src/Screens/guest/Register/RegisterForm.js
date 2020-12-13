import React from 'react';
import { ScrollView } from 'react-native';
import FormContainer from 'components/FormContainer';
import Button from 'components/FormWithContext/Button';
import SubmitButton from 'components/FormWithContext/SubmitButton';
import TextInput from 'components/FormWithContext/TextInput';

function RegisterForm () {
  return (
    <ScrollView>
      <FormContainer>
        <TextInput field="email" type="email" />
        <TextInput field="password" type="password" />
        <TextInput field="retypePassword" type="password" />
        <SubmitButton style={{ marginBottom: 20 }}>Create account</SubmitButton>
        <Button to="Login" color="red">
          Cancel
        </Button>
      </FormContainer>
    </ScrollView>
  );
}

export default React.memo(RegisterForm);
