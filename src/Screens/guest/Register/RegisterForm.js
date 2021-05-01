import React from 'react';
import { ScrollView, View } from 'react-native';
import { Text } from 'react-native-paper';
import Checkbox from 'components/Checkbox';
import { FormContext } from 'components/FormWithContext';
import SubmitButton from 'components/FormWithContext/SubmitButton';
import TextInput from 'components/FormWithContext/TextInput';
import PasswordStrength from 'components/PasswordStrength';
import TextLink from 'components/TextLink';

function RegisterForm () {
  const [hasAgreed, setAgreed] = React.useState(false);

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
        <Checkbox
          value={hasAgreed}
          onChange={setAgreed}
          content={
            <Text>
              Please tick the box on the left if you acknowledge that
              you have read, understood, and agreed with our{' '}
              <TextLink to="https://entrepic.com/privacy-policy">
                privacy policy
              </TextLink>{' '}
              and{' '}
              <TextLink to="https://entrepic.com/terms-and-conditions">
                terms and conditions
              </TextLink>
              .
            </Text>
          }
        />
        <SubmitButton
          style={{ marginBottom: 20 }}
          disabled={!hasAgreed}
        >
          Create account
        </SubmitButton>
      </View>
    </ScrollView>
  );
}

export default React.memo(RegisterForm);
