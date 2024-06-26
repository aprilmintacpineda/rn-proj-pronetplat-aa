import React from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import Animatable from 'components/Animatable';
import TouchableRipple from 'components/TouchableRipple';
import UserAvatar from 'components/UserAvatar';
import { getFullName, renderUserTitle } from 'libs/user';

function ContactListRow ({ index, ...contact }) {
  const fullName = getFullName(contact);
  const delay = (index % 10) * 50;

  return (
    <Animatable animation="fadeInFromRight" delay={delay}>
      <TouchableRipple to="ContactProfile" params={contact}>
        <View
          style={{
            flexDirection: 'row',
            margin: 15
          }}
        >
          <UserAvatar user={contact} />
          <View
            style={{
              marginLeft: 15,
              flex: 1,
              justifyContent: 'center'
            }}
          >
            <Text numberOfLines={1} style={{ fontSize: 18 }}>
              {fullName}
            </Text>
            {renderUserTitle(contact)}
          </View>
        </View>
      </TouchableRipple>
    </Animatable>
  );
}

export default React.memo(ContactListRow);
