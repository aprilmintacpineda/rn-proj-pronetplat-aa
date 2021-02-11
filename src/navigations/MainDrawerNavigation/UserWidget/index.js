import React from 'react';
import useFluxibleStore from 'react-fluxible/lib/useFluxibleStore';
import { View } from 'react-native';
import { Headline } from 'react-native-paper';
import TriggerComponent from './TriggerComponent';
import ChangeProfilePictureWidget from 'components/ChangeProfilePictureWidget';
import UserAvatar from 'components/UserAvatar';
import { getFullName, renderUserTitle } from 'libs/user';

function mapStates ({ authUser }) {
  return { authUser };
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
