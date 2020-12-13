import React from 'react';
import { ScrollView } from 'react-native';
import Button from 'components/FormWithContext/Button';
import SubmitButton from 'components/FormWithContext/SubmitButton';
import TextInput from 'components/FormWithContext/TextInput';
import GuestFormContainer from 'components/GuestFormContainer';

function RegisterForm () {
  return (
    <ScrollView>
      <GuestFormContainer>
        <TextInput field="email" type="email" />
        <TextInput field="password" type="password" />
        <TextInput field="retypePassword" type="password" />
        <SubmitButton style={{ marginBottom: 20 }}>Create account</SubmitButton>
        <Button to="Login" color="red">
          Cancel
        </Button>
      </GuestFormContainer>
    </ScrollView>
  );
}

export default React.memo(RegisterForm);
