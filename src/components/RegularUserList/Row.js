import React from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import Animatable from 'components/Animatable';
import TouchableRipple from 'components/TouchableRipple';
import UserAvatar from 'components/UserAvatar';
import { getFullName, renderUserTitle } from 'libs/user';

function BlockListRow ({ index, ...contactData }) {
  const fullName = getFullName(contactData);
  const delay = (index % 10) * 50;

  return (
    <Animatable animation="fadeInFromRight" delay={delay}>
      <TouchableRipple to="ContactProfile" params={contactData}>
        <View
          style={{
            flexDirection: 'row',
            margin: 15
          }}
        >
          <UserAvatar user={contactData} />
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
            {renderUserTitle(contactData)}
          </View>
        </View>
      </TouchableRipple>
    </Animatable>
  );
}

export default React.memo(BlockListRow);
