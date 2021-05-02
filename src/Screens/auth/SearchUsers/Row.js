import React from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import Animatable from 'components/Animatable';
import TouchableRipple from 'components/TouchableRipple';
import UserAvatar from 'components/UserAvatar';
import { getFullName, renderUserTitle } from 'libs/user';

function SearchUserRow ({ index, ...user }) {
  const fullName = getFullName(user);
  const delay = (index % 10) * 100;

  return (
    <>
      <Animatable animation="fadeInFromRight" delay={delay}>
        <TouchableRipple to="ContactProfile" params={user}>
          <View style={{ flexDirection: 'row', padding: 15 }}>
            <UserAvatar user={user} />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text numberOfLines={1} style={{ fontSize: 18 }}>
                {fullName}
              </Text>
              {renderUserTitle(user)}
            </View>
          </View>
        </TouchableRipple>
      </Animatable>
    </>
  );
}

export default React.memo(SearchUserRow);
