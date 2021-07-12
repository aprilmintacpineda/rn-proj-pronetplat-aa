import React from 'react';
import { ScrollView, View } from 'react-native';
import { Subheading, Text } from 'react-native-paper';
import Location from './Location';
import Organizers from './Organizers';
import DateTimePicker from 'components/FormWithContext/DateTimePicker';
import SelectOptions from 'components/FormWithContext/SelectOptions';
import SubmitButton from 'components/FormWithContext/SubmitButton';
import TextInput from 'components/FormWithContext/TextInput';

const visibilityOptions = ['private', 'public'];

function CreateEventForm () {
  return (
    <>
      <ScrollView>
        <View style={{ padding: 10 }}>
          <TextInput
            field="name"
            label="Name or title of event"
            displayCharsRemaining
            maxLength={100}
          />
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
          <SelectOptions
            field="visibility"
            options={visibilityOptions}
          />
          <TextInput
            type="number"
            field="maxAttendees"
            label="Max number of atttendees"
          />
          <View>
            <Subheading style={{ fontWeight: 'bold' }}>
              Organizers
            </Subheading>
            <Text>
              Who are the organizers of this event? You are required
              to be on this list.
            </Text>
            <Organizers />
          </View>
          <Location />
          <SubmitButton>Create event</SubmitButton>
        </View>
      </ScrollView>
    </>
  );
}

export default React.memo(CreateEventForm);
