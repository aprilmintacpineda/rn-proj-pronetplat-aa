import React from 'react';
import useFluxibleStore from 'react-fluxible/lib/useFluxibleStore';
import { View } from 'react-native';
import {
  ActivityIndicator,
  Headline,
  IconButton
} from 'react-native-paper';
import ChangeProfilePictureWidget from 'components/ChangeProfilePictureWidget';
import RNVectorIcon from 'components/RNVectorIcon';
import UserAvatar from 'components/UserAvatar';
import { getFullName, renderUserTitle } from 'libs/user';
import { paperTheme } from 'theme';

function mapStates ({ authUser }) {
  return { authUser };
}

function editIcon (props) {
  return (
    <RNVectorIcon
      provider="MaterialCommunityIcons"
      name="image-edit"
      {...props}
    />
  );
}

function TriggerComponent ({ onPress, disabled }) {
  if (disabled) {
    return (
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          left: 0,
          alignItems: 'flex-end'
        }}
      >
        <View
          style={{
            backgroundColor: paperTheme.colors.primary,
            borderRadius: 100,
            padding: 5
          }}
        >
          <ActivityIndicator size={15} color="#fff" />
        </View>
      </View>
    );
  }

  return (
    <View
      style={{
        position: 'absolute',
        bottom: -10,
        right: -10,
        left: 0,
        alignItems: 'flex-end'
      }}
    >
      <View
        style={{
          borderRadius: 100,
          backgroundColor: '#fff'
        }}
      >
        <IconButton
          color={paperTheme.colors.primary}
          size={25}
          style={{
            margin: 0,
            padding: 0
          }}
          onPress={onPress}
          icon={editIcon}
        />
      </View>
    </View>
  );
}

function UserWidget () {
  const { authUser } = useFluxibleStore(mapStates);

  return (
    <View style={{ alignItems: 'center', marginTop: 20 }}>
      <View style={{ position: 'relative' }}>
        <UserAvatar user={authUser} size={100} />
        <ChangeProfilePictureWidget
          TriggerComponent={TriggerComponent}
        />
      </View>
      <View style={{ marginTop: 15 }}>
        <Headline style={{ textAlign: 'center' }} numberOfLines={3}>
          {getFullName(authUser)}
        </Headline>
        <View style={{ alignItems: 'center' }}>
          {renderUserTitle(authUser, {
            style: { textAlign: 'center' },
            numberOfLines: 3
          })}
        </View>
      </View>
    </View>
  );
}

export default React.memo(UserWidget);
