import React from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import Animatable from 'components/Animatable';
import RNVectorIcon from 'components/RNVectorIcon';
import TouchableButtonLink from 'components/TouchableButtonLink';
import UserAvatar from 'components/UserAvatar';
import { getFullName, renderContactTitle } from 'libs/contact';
import { paperTheme } from 'theme';

const { success, disabled } = paperTheme.colors;

function ContactListRow ({ index, ...contactData }) {
  const { hasEmail, hasMobile, hasTelephone } = contactData;
  const fullName = getFullName(contactData);
  const delay = (index % 10) * 50;

  return (
    <Animatable animation="fadeInFromRight" delay={delay}>
      <TouchableButtonLink to="ContactProfile" params={contactData}>
        <View
          style={{
            flexDirection: 'row',
            margin: 15
          }}
        >
          <UserAvatar user={contactData} />
          <View style={{ marginLeft: 15, flex: 1 }}>
            <Text numberOfLines={1} style={{ fontSize: 18 }}>
              {fullName}
            </Text>
            {renderContactTitle(contactData)}
            <View style={{ flexDirection: 'row', marginTop: 3 }}>
              <View style={{ marginRight: 3 }}>
                <RNVectorIcon
                  provider="Entypo"
                  name="email"
                  size={12}
                  color={hasEmail ? success : disabled}
                />
              </View>
              <View style={{ marginRight: 3 }}>
                <RNVectorIcon
                  provider="Entypo"
                  name="mobile"
                  size={12}
                  color={hasMobile ? success : disabled}
                />
              </View>
              <View style={{ marginRight: 3 }}>
                <RNVectorIcon
                  provider="MaterialCommunityIcons"
                  name="phone-classic"
                  size={12}
                  color={hasTelephone ? success : disabled}
                />
              </View>
            </View>
          </View>
        </View>
      </TouchableButtonLink>
    </Animatable>
  );
}

export default React.memo(ContactListRow);
