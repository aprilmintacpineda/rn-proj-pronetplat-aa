import React from 'react';
import { View } from 'react-native';
import { Headline, Text } from 'react-native-paper';
import Modalize from './Modalize';
import UserAvatar from './UserAvatar';
import { getFullName, renderUserTitle } from 'libs/user';

function UserModalize ({ user, children }, modalizeRef) {
  const fullName = getFullName(user);

  return (
    <Modalize ref={modalizeRef}>
      <View style={{ marginBottom: 30 }}>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <UserAvatar user={user} size={100} />
          <View style={{ marginTop: 15 }}>
            <Headline
              style={{ textAlign: 'center' }}
              numberOfLines={3}
            >
              {fullName}
            </Headline>
            <View style={{ alignItems: 'center' }}>
              {renderUserTitle(user, {
                textAlign: 'center',
                numberOfLines: 3
              })}
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
          {user.bio}
        </Text>
      </View>
      {children}
    </Modalize>
  );
}

export default React.forwardRef(UserModalize);
