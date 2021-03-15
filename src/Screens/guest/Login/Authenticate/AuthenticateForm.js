import React from 'react';
import { ScrollView, View } from 'react-native';
import { FormContext } from 'components/FormWithContext';
import Button from 'components/FormWithContext/Button';
import SubmitButton from 'components/FormWithContext/SubmitButton';
import TextInput from 'components/FormWithContext/TextInput';
import LoginContext from 'root/Screens/guest/Login/LoginContext';
import HeadName from 'svgs/HeadName';
import Logo from 'svgs/Logo';
import SubHeadName from 'svgs/SubHeadName';
import { paperTheme } from 'theme';

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
      <View>
        <View
          style={{
            flex: 1,
            backgroundColor: paperTheme.colors.accent,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 30
          }}
        >
          <Logo width={100} height={100} />
          <HeadName style={{ marginVertical: 15 }} />
          <SubHeadName />
        </View>
        <View style={{ margin: 20 }}>
          <TextInput field="email" type="email" />
          <TextInput field="password" type="password" />
          <SubmitButton>Submit</SubmitButton>
          <View style={{ marginTop: 50, marginBottom: 20 }}>
            <Button style={{ marginBottom: 10 }} to="Register">
              Register
            </Button>
            <Button to="ForgotPassword">Forgot password</Button>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

export default React.memo(AuthenticateForm);
