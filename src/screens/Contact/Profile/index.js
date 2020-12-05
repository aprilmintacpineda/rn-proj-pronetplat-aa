import React from 'react';
import { FlatList, View } from 'react-native';
import { Headline, Text } from 'react-native-paper';

import UserAvatar from 'components/UserAvatar';
import { getFullName, renderContactTitle } from 'helpers/contact';
import ContactDetailRow from './Row';

const contactDetails = [
  {
    id: '1',
    type: 'email',
    value: 'test@user1.com'
  },
  {
    id: '2',
    type: 'mobile',
    value: '6523426'
  },
  {
    id: '3',
    type: 'telephone',
    value: '1234534'
  }
];

function renderItem ({ item }) {
  return <ContactDetailRow {...item} />;
}

function keyExtractor ({ id }) {
  return id;
}

function ContactProfile ({ route: { params: contactData } }) {
  const fullName = getFullName(contactData);
  const { bio } = contactData;

  return (
    <FlatList
      ListHeaderComponent={
        <View style={{ margin: 15, marginTop: 30 }}>
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <UserAvatar {...contactData} size={100} />
            <View style={{ marginTop: 15 }}>
              <Headline style={{ textAlign: 'center' }}>{fullName}</Headline>
              {renderContactTitle(contactData, { justifyContent: 'center' })}
            </View>
          </View>
          <Text style={{ textAlign: 'center', marginTop: 15, color: 'gray' }}>{bio}</Text>
        </View>
      }
      data={contactDetails}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
    />
  );
}

export default React.memo(ContactProfile);
