import React from 'react';
import useFluxibleStore from 'react-fluxible/lib/useFluxibleStore';
import { ScrollView, View } from 'react-native';
import { FormContext } from 'components/FormWithContext';
import SelectOptions from 'components/FormWithContext/SelectOptions';
import SubmitButton from 'components/FormWithContext/SubmitButton';
import TextInput from 'components/FormWithContext/TextInput';

const genderOptions = ['male', 'female'];

function mapStates ({ authUser }) {
  return { authUser };
}

function ChangePersonalInfoForm () {
  const { authUser } = useFluxibleStore(mapStates);
  const { setUpdateMode } = React.useContext(FormContext);

  React.useEffect(() => {
    setUpdateMode({
      formValues: {
        firstName: authUser.firstName,
        middleName: authUser.middleName,
        surname: authUser.surname,
        gender: authUser.gender,
        jobTitle: authUser.jobTitle,
        company: authUser.company,
        bio: authUser.bio
      }
    });
  }, [authUser, setUpdateMode]);

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
