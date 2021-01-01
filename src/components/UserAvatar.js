import React from 'react';
import useFluxibleStore from 'react-fluxible/lib/useFluxibleStore';
import Avatar from './Avatar';

function mapStates ({ authUser }) {
  return { authUser };
}

function UserAvatar ({ size = 60 }) {
  const { authUser } = useFluxibleStore(mapStates);
  const { profilePicture, firstName, middleName, surname } = authUser;

  const label = (
    (firstName?.[0] || 'A') +
    (middleName?.[0] || 'B') +
    (surname?.[0] || 'C')
  ).toUpperCase();

  return <Avatar uri={profilePicture} label={label} size={size} />;
}

export default React.memo(UserAvatar);
