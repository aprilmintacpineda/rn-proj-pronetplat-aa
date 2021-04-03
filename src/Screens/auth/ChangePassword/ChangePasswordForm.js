import React from 'react';
import { ScrollView, View } from 'react-native';
import { FormContext } from 'components/FormWithContext';
import SubmitButton from 'components/FormWithContext/SubmitButton';
import TextInput from 'components/FormWithContext/TextInput';
import PasswordStrength from 'components/PasswordStrength';

function ChangePasswordForm () {
  const {
    formValues: { newPassword }
  } = React.useContext(FormContext);

  return (
    <ScrollView>
      <View
        style={{
          padding: 15
        }}
      >
        <TextInput field="currentPassword" type="password" />
        <PasswordStrength value={newPassword} />
        <TextInput field="newPassword" type="password" />
        <TextInput field="retypeNewPassword" type="password" />
        <SubmitButton>Change my password</SubmitButton>
      </View>
    </ScrollView>
  );
}

export default React.memo(ChangePasswordForm);
