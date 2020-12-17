import React from 'react';
import { ScrollView, View } from 'react-native';
import FormContainer from 'components/FormContainer';
import { FormContext } from 'components/FormWithContext';
import Button from 'components/FormWithContext/Button';
import SubmitButton from 'components/FormWithContext/SubmitButton';
import TextInput from 'components/FormWithContext/TextInput';

function VerifyEmailForm ({ onCancel, onVerified }) {
  const { responseData, isSubmitSuccess } = React.useContext(FormContext);

  React.useEffect(() => {
    if (isSubmitSuccess) onVerified(responseData);
  }, [isSubmitSuccess, responseData, onVerified]);

  return (
    <ScrollView>
      <FormContainer>
        <TextInput field="verificationCode" type="code" />
        <SubmitButton>Submit</SubmitButton>
      </FormContainer>
      <View style={{ margin: 20 }}>
        <Button onPress={onCancel} color="red">
          Cancel
        </Button>
      </View>
    </ScrollView>
  );
}

export default React.memo(VerifyEmailForm);
