import React from 'react';
import { ScrollView, View } from 'react-native';
import { Headline, Text } from 'react-native-paper';
import ContactDetails from './ContactDetails';
import UserAvatar from 'components/UserAvatar';
import { getFullName, renderContactTitle } from 'libs/contact';

function ContactProfile ({ route: { params: contactData } }) {
  const fullName = getFullName(contactData);

  return (
    <ScrollView>
      <View style={{ margin: 15, marginTop: 30 }}>
        <View
          style={{ alignItems: 'center', justifyContent: 'center' }}
        >
          <UserAvatar user={contactData} size={100} />
          <View style={{ marginTop: 15 }}>
            <Headline style={{ textAlign: 'center' }}>
              {fullName}
            </Headline>
            <View style={{ alignItems: 'center' }}>
              {renderContactTitle(contactData)}
            </View>
          </View>
        </View>
        <Text
          style={{
            textAlign: 'center',
            marginTop: 15,
            color: 'gray'
          }}
        >
          {contactData.bio}
        </Text>
      </View>
      <ContactDetails {...contactData} />
    </ScrollView>
  );
}

export default React.memo(ContactProfile);
