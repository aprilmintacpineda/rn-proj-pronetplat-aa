import React from 'react';
import { View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import TouchableButtonLink from 'components/TouchableButtonLink';
import UserAvatar from 'components/UserAvatar';
import { getFullName, renderContactTitle } from 'helpers/contact';

function ContactListRow (contactData) {
  const {
    hasEmail,
    hasMobile,
    hasTelephone
  } = contactData;

  const {
    colors: { primary }
  } = useTheme();

  const fullName = getFullName(contactData);

  return (
    <TouchableButtonLink to="ContactProfile" params={contactData}>
      <View
        style={{
          flexDirection: 'row',
          margin: 15
        }}>
        <UserAvatar {...contactData} />
        <View style={{ marginLeft: 15, flex: 1 }}>
          <Text style={{ fontSize: 18 }}>{fullName}</Text>
          {renderContactTitle(contactData)}
          <View style={{ flexDirection: 'row', marginTop: 3 }}>
            <View style={{ marginRight: 3 }}>
              <Entypo name="email" size={12} color={hasEmail ? primary : '#c9c7c7'} />
            </View>
            <View style={{ marginRight: 3 }}>
              <Entypo name="mobile" size={12} color={hasMobile ? primary : '#c9c7c7'} />
            </View>
            <View style={{ marginRight: 3 }}>
              <MaterialCommunityIcons
                name="phone-classic"
                size={12}
                color={hasTelephone ? primary : '#c9c7c7'}
              />
            </View>
          </View>
        </View>
      </View>
    </TouchableButtonLink>
  );
}

export default React.memo(ContactListRow);
