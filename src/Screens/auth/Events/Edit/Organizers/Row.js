import React from 'react';
import useFluxibleStore from 'react-fluxible/lib/useFluxibleStore';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import Animatable from 'components/Animatable';
import IconButton from 'components/IconButton';
import RNVectorIcon from 'components/RNVectorIcon';
import TouchableRipple from 'components/TouchableRipple';
import UserAvatar from 'components/UserAvatar';
import { getFullName, renderUserTitle } from 'libs/user';

function addIcon (props) {
  return (
    <RNVectorIcon
      {...props}
      provider="Ionicons"
      name="ios-close-outline"
    />
  );
}

function mapStates ({ authUser }) {
  return { authUser };
}

function OrganizerRow ({ index, ...user }) {
  const fullName = getFullName(user);
  const delay = (index % 10) * 100;
  const { authUser } = useFluxibleStore(mapStates);

  const handleRemove = React.useCallback(() => {
    console.log('remove');
  }, []);

  return (
    <>
      <Animatable animation="fadeInFromRight" delay={delay}>
        {authUser.id !== user.id ? (
          <TouchableRipple to="ContactProfile" params={user}>
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
                <IconButton
                  icon={addIcon}
                  onPress={handleRemove}
                  size={20}
                />
              </View>
            </View>
          </TouchableRipple>
        ) : (
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
          </View>
        )}
      </Animatable>
    </>
  );
}

export default React.memo(OrganizerRow);
