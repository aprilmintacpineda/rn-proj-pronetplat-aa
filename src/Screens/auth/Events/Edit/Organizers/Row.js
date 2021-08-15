import { useNavigation, useRoute } from '@react-navigation/native';
import { emitEvent } from 'fluxible-js';
import React from 'react';
import useFluxibleStore from 'react-fluxible/lib/useFluxibleStore';
import { View } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';
import Animatable from 'components/Animatable';
import IconButton from 'components/IconButton';
import RNVectorIcon from 'components/RNVectorIcon';
import TouchableRipple from 'components/TouchableRipple';
import UserAvatar from 'components/UserAvatar';
import { unknownErrorPopup } from 'fluxible/actions/popup';
import { getFullName, renderUserTitle } from 'libs/user';
import { xhr } from 'libs/xhr';
import { paperTheme } from 'theme';

function removeIcon (props) {
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
  const [isRemoving, setIsRemoving] = React.useState(false);
  const { params: event } = useRoute();
  const { setParams } = useNavigation();

  const handleRemove = React.useCallback(async () => {
    try {
      setIsRemoving(true);

      await xhr(`/events/organizers/${event.id}/${user.id}`, {
        method: 'delete'
      });

      emitEvent('organizerRemoved', user.id);

      setParams({
        ...event,
        numOrganizers: event.numOrganizers - 1
      });
    } catch (error) {
      console.log(error);
      unknownErrorPopup();
      setIsRemoving(false);
    }
  }, [user, event, setParams]);

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
                {isRemoving ? (
                  <View
                    style={{
                      backgroundColor: paperTheme.colors.primary,
                      borderRadius: 100,
                      padding: 5
                    }}
                  >
                    <ActivityIndicator size={20} color="#fff" />
                  </View>
                ) : (
                  <IconButton
                    icon={removeIcon}
                    onPress={handleRemove}
                    size={20}
                  />
                )}
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
