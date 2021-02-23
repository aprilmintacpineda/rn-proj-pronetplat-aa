import React from 'react';
import { ScrollView, View } from 'react-native';
import { FormContext } from 'components/FormWithContext';
import SelectOptions from 'components/FormWithContext/SelectOptions';
import SubmitButton from 'components/FormWithContext/SubmitButton';
import TextInput from 'components/FormWithContext/TextInput';

const contactDetailTypeOptions = [
  'mobile',
  'telephone',
  'website',
  'email'
];

function ContactDetailsAddForm () {
  const { formValues } = React.useContext(FormContext);

  return (
    <ScrollView>
      <View
        style={{
          padding: 15
        }}
      >
        <SelectOptions
          field="type"
          options={contactDetailTypeOptions}
        />
        <TextInput field="value" type={formValues.type} />
        <TextInput
          multiline
          numberOfLines={8}
          displayCharsRemaining
          maxLength={150}
          field="description"
          helperText="A helpful description for your contacts."
        />
        <SubmitButton>Save</SubmitButton>
      </View>
    </ScrollView>
  );
}

export default React.memo(ContactDetailsAddForm);
