import React from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import FormContainer from 'components/FormContainer';
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
      <FormContainer>
        <TextInput field="email" type="email" />
        <SubmitButton style={{ marginBottom: 20 }}>
          Send reset code
        </SubmitButton>
      </FormContainer>
    </ScrollView>
  );
}

export default React.memo(SendResetCodeForm);
