import React from 'react';
import { View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Headline, Subheading } from 'react-native-paper';
import { FormContext } from 'components/FormWithContext';
import SubmitButton from 'components/FormWithContext/SubmitButton';
import TextInput from 'components/FormWithContext/TextInput';

function SendResetCodeForm ({ onResetCodeSent }) {
  const { isSubmitSuccess, formValues } = React.useContext(
    FormContext
  );
  const { email } = formValues;

  React.useEffect(() => {
    if (isSubmitSuccess) onResetCodeSent(email);
  }, [isSubmitSuccess, email, onResetCodeSent]);

  return (
    <ScrollView>
      <View style={{ margin: 20 }}>
        <Headline>{"Don't"} worry</Headline>
        <Subheading style={{ marginBottom: 20 }}>
          That happens to everyone and {"we're"} here to help. Just
          enter your email below.
        </Subheading>
        <TextInput field="email" type="email" />
        <SubmitButton style={{ marginBottom: 20 }}>
          Send reset code
        </SubmitButton>
      </View>
    </ScrollView>
  );
}

export default React.memo(SendResetCodeForm);
