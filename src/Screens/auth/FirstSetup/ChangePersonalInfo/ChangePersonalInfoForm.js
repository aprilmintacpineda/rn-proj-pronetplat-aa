import React from 'react';
import { ScrollView, View } from 'react-native';
import { Divider, Headline, Subheading } from 'react-native-paper';
import FormContainer from 'components/FormContainer';
import { FormContext } from 'components/FormWithContext';
import SelectOptions from 'components/FormWithContext/SelectOptions';
import SubmitButton from 'components/FormWithContext/SubmitButton';
import TextInput from 'components/FormWithContext/TextInput';

const genderOptions = ['male', 'female'];

function ChangePersonalInfoForm ({ onSave }) {
  const { isSubmitSuccess } = React.useContext(FormContext);

  React.useEffect(() => {
    if (isSubmitSuccess) onSave();
  }, [isSubmitSuccess, onSave]);

  return (
    <ScrollView>
      <FormContainer>
        <Headline>Setup your account</Headline>
        <Subheading>
          Formally introduce yourself to your network by telling them basic information
          about yourself.
        </Subheading>
        <Divider style={{ marginVertical: 20 }} />
        <TextInput field="firstName" />
        <TextInput field="middleName" labelSuffix="(Optional)" />
        <TextInput field="surname" />
        <SelectOptions field="gender" options={genderOptions} />
        <TextInput field="company" labelSuffix="(Optional)" />
        <TextInput field="jobTitle" labelSuffix="(e.g., Software Engineer)" />
      </FormContainer>
      <View style={{ margin: 20 }}>
        <SubmitButton>Save</SubmitButton>
      </View>
    </ScrollView>
  );
}

export default React.memo(ChangePersonalInfoForm);
