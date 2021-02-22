import React from 'react';
import { ScrollView, View } from 'react-native';
import SubmitButton from 'components/FormWithContext/SubmitButton';
import TextInput from 'components/FormWithContext/TextInput';

function ContactDetailsAddForm () {
  return (
    <ScrollView>
      <View
        style={{
          padding: 15
        }}
      >
        <TextInput field="value" />
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
