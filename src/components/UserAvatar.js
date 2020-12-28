import React from 'react';
import useFluxibleStore from 'react-fluxible/lib/useFluxibleStore';
import { Avatar } from 'react-native-paper';

function mapStates ({ authUser }) {
  return { authUser };
}

function UserAvatar ({ size = 60 }) {
  const { authUser } = useFluxibleStore(mapStates);
  const { profilePicture, firstName, middleName, surname } = authUser;

  if (profilePicture)
    return <Avatar.Image source={{ uri: profilePicture }} size={size} />;

  const avatarLabel = (
    (firstName?.[0] || 'A') +
    (middleName?.[0] || 'B') +
    (surname?.[0] || 'C')
  ).toUpperCase();

  return (
    <Avatar.Text
      label={avatarLabel}
      labelStyle={{ fontSize: Math.floor(size * 0.37) }}
      size={size}
    />
  );
}

export default React.memo(UserAvatar);
