import React from 'react';
import { ScrollView, View } from 'react-native';
import SelectOptions from 'components/FormWithContext/SelectOptions';
import SubmitButton from 'components/FormWithContext/SubmitButton';
import TextInput from 'components/FormWithContext/TextInput';

const genderOptions = ['male', 'female'];

function ChangePersonalInfoForm () {
  return (
    <ScrollView>
      <View style={{ margin: 15 }}>
        <TextInput field="firstName" />
        <TextInput field="middleName" labelSuffix="(Optional)" />
        <TextInput field="surname" />
        <SelectOptions field="gender" options={genderOptions} />
        <TextInput field="company" labelSuffix="(Optional)" />
        <TextInput
          field="jobTitle"
          labelSuffix="(e.g., Software Engineer)"
        />
        <TextInput
          multiline
          numberOfLines={8}
          labelSuffix="(Optional)"
          displayCharsRemaining
          maxLength={255}
          field="bio"
          helperText="A short description of the services you offer."
        />
        <SubmitButton>Save</SubmitButton>
      </View>
    </ScrollView>
  );
}

export default React.memo(ChangePersonalInfoForm);
