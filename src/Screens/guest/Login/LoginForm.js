import React from 'react';
import { View } from 'react-native';
import Button from 'components/FormWithContext/Button';
import SubmitButton from 'components/FormWithContext/SubmitButton';
import TextInput from 'components/FormWithContext/TextInput';
import GuestFormContainer from 'components/GuestFormContainer';

function LoginForm () {
  return (
    <>
      <GuestFormContainer>
        <TextInput field="email" type="email" />
        <TextInput field="password" type="password" />
        <SubmitButton>Submit</SubmitButton>
      </GuestFormContainer>
      <View style={{ margin: 20 }}>
        <Button to="Register">Register</Button>
      </View>
    </>
  );
}

export default React.memo(LoginForm);
