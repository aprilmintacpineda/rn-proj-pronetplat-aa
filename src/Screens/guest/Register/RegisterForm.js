import React from 'react';
import { ScrollView } from 'react-native';
import Button from 'components/FormWithContext/Button';
import SelectOptions from 'components/FormWithContext/SelectOptions';
import SubmitButton from 'components/FormWithContext/SubmitButton';
import TextInput from 'components/FormWithContext/TextInput';
import GuestFormContainer from 'components/GuestFormContainer';

const genderOptions = ['male', 'female'];

function RegisterForm () {
  return (
    <ScrollView>
      <GuestFormContainer>
        <TextInput field="givenName" type="givenName" />
        <TextInput field="middleName" labelSuffix="(Optional)" type="middleName" />
        <TextInput field="surname" type="surname" />
        <SelectOptions field="gender" options={genderOptions} />
        <TextInput field="email" type="email" />
        <TextInput field="password" type="password" />
        <TextInput field="retypePassword" type="password" />
        <SubmitButton style={{ marginBottom: 20 }}>Create account</SubmitButton>
        <Button to="Login" color="red">
          Cancel
        </Button>
      </GuestFormContainer>
    </ScrollView>
  );
}

export default React.memo(RegisterForm);
