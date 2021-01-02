import React from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import Avatar from 'components/Avatar';
import Caption from 'components/Caption';
import TimeAgo from 'components/TimeAgo';
import { renderContactTitle } from 'helpers/contact';

function ContactRequestRow ({ sender, createdAt }) {
  const { profilePicture, firstName, middleName, surname } = sender;

  const avatarLabel = (firstName[0] + (middleName?.[0] || '') + surname[0]).toUpperCase();

  console.log('ContactRequestRow', createdAt);

  const fullName = `${firstName}${middleName ? ` ${middleName} ` : ' '}${surname}`;

  return (
    <View style={{ flexDirection: 'row', padding: 15 }}>
      <Avatar uri={profilePicture} label={avatarLabel} />
      <View style={{ flex: 1, marginLeft: 10 }}>
        <Text numberOfLines={1} style={{ fontSize: 18 }}>
          {fullName}
        </Text>
        {renderContactTitle(sender)}
        <Caption>
          <TimeAgo dateFrom={createdAt} />
        </Caption>
      </View>
    </View>
  );
}

export default React.memo(ContactRequestRow);
