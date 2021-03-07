import React from 'react';
import { ScrollView, View } from 'react-native';
import { Divider, Headline, Subheading } from 'react-native-paper';
import FormContainer from 'components/FormContainer';
import { FormContext } from 'components/FormWithContext';
import Button from 'components/FormWithContext/Button';
import SubmitButton from 'components/FormWithContext/SubmitButton';
import TextInput from 'components/FormWithContext/TextInput';
import LoginContext from 'root/Screens/guest/Login/LoginContext';

function AuthenticateForm ({ onLogin }) {
  const {
    responseData,
    isSubmitSuccess,
    resetForm,
    isTouched
  } = React.useContext(FormContext);
  const { page } = React.useContext(LoginContext);

  React.useEffect(() => {
    if (isSubmitSuccess) onLogin(responseData);
  }, [isSubmitSuccess, responseData, onLogin, resetForm]);

  React.useEffect(() => {
    if (page !== 1 && isTouched) resetForm();
  }, [page, isTouched, resetForm]);

  return (
    <ScrollView>
      <FormContainer>
        <Headline>EntrepConnect</Headline>
        <Subheading>Make professional connections.</Subheading>
        <Divider style={{ marginVertical: 20 }} />
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

export default React.memo(AuthenticateForm);
