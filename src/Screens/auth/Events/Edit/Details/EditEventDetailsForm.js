import { useRoute } from '@react-navigation/native';
import React from 'react';
import { ScrollView, View } from 'react-native';
import { FormContext } from 'components/FormWithContext';
import DateTimePicker from 'components/FormWithContext/DateTimePicker';
import SelectOptions from 'components/FormWithContext/SelectOptions';
import SubmitButton from 'components/FormWithContext/SubmitButton';
import TextInput from 'components/FormWithContext/TextInput';
import Location from 'root/Screens/auth/Events/Create/Location';

const visibilityOptions = ['private', 'public'];

function EditEventDetailsForm () {
  const { setUpdateMode } = React.useContext(FormContext);
  const { params: event } = useRoute();

  React.useEffect(() => {
    setUpdateMode({
      targetId: event.id,
      formValues: {
        name: event.name,
        description: event.description,
        startDateTime: new Date(event.startDateTime),
        endDateTime: new Date(event.endDateTime),
        location: {
          address: event.address,
          location: {
            latitude: event.latitude,
            longitude: event.longitude
          },
          placeID: event.googlePlaceId,
          name: event.placeName
        },
        visibility: event.visibility,
        maxAttendees: event.maxAttendees,
        organization: event.organization,
        category: event.category,
        topic: event.topic,
        subtopic: event.subtopic
      }
    });
  }, [event, setUpdateMode]);

  return (
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
        <Location />
        <SubmitButton>Save changes</SubmitButton>
      </View>
    </ScrollView>
  );
}

export default React.memo(EditEventDetailsForm);
