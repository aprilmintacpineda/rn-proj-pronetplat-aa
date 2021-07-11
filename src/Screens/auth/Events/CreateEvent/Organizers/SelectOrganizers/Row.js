import React from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import Animatable from 'components/Animatable';
import IconButton from 'components/IconButton';
import RNVectorIcon from 'components/RNVectorIcon';
import UserAvatar from 'components/UserAvatar';
import { getFullName, renderUserTitle } from 'libs/user';
import { paperTheme } from 'theme';

function addIcon (props) {
  return (
    <RNVectorIcon
      {...props}
      provider="Ionicons"
      name="ios-add-outline"
    />
  );
}

function SearchUserRow ({ index, onSelect, selectedUsers, ...user }) {
  const fullName = getFullName(user);
  const delay = (index % 10) * 100;

  const handleSelect = React.useCallback(() => {
    onSelect(user);
  }, [onSelect, user]);

  const isSelected = selectedUsers.find(
    selectedUser => selectedUser.id === user.id
  );

  return (
    <>
      <Animatable animation="fadeInFromRight" delay={delay}>
        <View
          style={{
            flexDirection: 'row',
            padding: 15
          }}
        >
          <UserAvatar user={user} />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text numberOfLines={1} style={{ fontSize: 18 }}>
              {fullName}
            </Text>
            {renderUserTitle(user)}
          </View>
          <View style={{ justifyContent: 'center' }}>
            {isSelected ? (
              <RNVectorIcon
                provider="Ionicons"
                name="ios-checkmark-outline"
                size={25}
                style={{ padding: 10 }}
                color={paperTheme.colors.primary}
              />
            ) : (
              <IconButton
                icon={addIcon}
                onPress={handleSelect}
                size={20}
              />
            )}
          </View>
        </View>
      </Animatable>
    </>
  );
}

export default React.memo(SearchUserRow);
