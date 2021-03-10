import React from 'react';
import { ScrollView, View } from 'react-native';
import { FormContext } from 'components/FormWithContext';
import SubmitButton from 'components/FormWithContext/SubmitButton';
import TextInput from 'components/FormWithContext/TextInput';
import PasswordStrength from 'components/PasswordStrength';

function RegisterForm () {
  const {
    formValues: { password }
  } = React.useContext(FormContext);

  return (
    <ScrollView>
      <View style={{ margin: 20 }}>
        <TextInput field="email" type="email" />
        <PasswordStrength value={password} />
        <TextInput field="password" type="password" />
        <TextInput field="retypePassword" type="password" />
        <SubmitButton style={{ marginBottom: 20 }}>
          Create account
        </SubmitButton>
      </View>
    </ScrollView>
  );
}

export default React.memo(RegisterForm);
