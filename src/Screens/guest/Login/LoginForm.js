import React from 'react';
import { ScrollView, View } from 'react-native';
import FormContainer from 'components/FormContainer';
import Button from 'components/FormWithContext/Button';
import SubmitButton from 'components/FormWithContext/SubmitButton';
import TextInput from 'components/FormWithContext/TextInput';

function LoginForm () {
  return (
    <ScrollView>
      <FormContainer>
        <TextInput field="email" type="email" />
        <TextInput field="password" type="password" />
        <SubmitButton>Submit</SubmitButton>
      </FormContainer>
      <View style={{ margin: 20 }}>
        <Button to="Register">Register</Button>
        <Button to="ForgotPassword">Forgot password</Button>
      </View>
    </ScrollView>
  );
}

export default React.memo(LoginForm);
