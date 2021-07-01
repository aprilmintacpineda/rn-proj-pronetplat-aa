import React from 'react';
import { View } from 'react-native';
import DateTimePicker from 'components/FormWithContext/DateTimePicker';
import TextInput from 'components/FormWithContext/TextInput';

function CreateEventForm () {
  return (
    <View style={{ padding: 10 }}>
      <TextInput field="name" label="Name or title of event" />
      <TextInput
        multiline
        numberOfLines={10}
        displayCharsRemaining
        maxLength={5000}
        field="description"
        helperText="Tell others what the event is about, add links to relevant sources, etc."
      />
      <DateTimePicker field="startDateTime" askTime />
      <DateTimePicker field="endDateTime" askTime />
    </View>
  );
}

export default React.memo(CreateEventForm);
