import { useNavigation, useRoute } from '@react-navigation/native';
import React from 'react';
import { ScrollView, View } from 'react-native';
import { Caption, Text } from 'react-native-paper';
import { FormContext } from 'components/FormWithContext';
import Checkbox from 'components/FormWithContext/Checkbox';
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
  const { setOptions } = useNavigation();
  const { params: contactDetail } = useRoute();
  const { formValues, setUpdateMode } = React.useContext(
    FormContext
  );

  React.useEffect(() => {
    if (!contactDetail) {
      setOptions({ title: 'Add contact detail' });
    } else {
      setOptions({ title: 'Edit contact detail' });

      setUpdateMode({
        targetId: contactDetail.id,
        formValues: {
          value: contactDetail.value,
          description: contactDetail.description,
          type: contactDetail.type,
          isCloseFriendsOnly:
            contactDetail.isCloseFriendsOnly || false
        }
      });
    }
  }, [setOptions, setUpdateMode, contactDetail]);

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
          maxLength={100}
          field="description"
          helperText="A helpful description for your contacts."
        />
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'flex-start',
            marginBottom: 30
          }}
        >
          <Checkbox field="isCloseFriendsOnly" />
          <View style={{ flex: 1 }}>
            <Text>Close friends only</Text>
            <Caption>
              When this is checked. This will only be visible to your
              close friends.
            </Caption>
          </View>
        </View>
        <SubmitButton>Save</SubmitButton>
      </View>
    </ScrollView>
  );
}

export default React.memo(ContactDetailsAddForm);
