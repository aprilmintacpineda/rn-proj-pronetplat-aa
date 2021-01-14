import React from 'react';
import useFluxibleStore from 'react-fluxible/lib/useFluxibleStore';
import Avatar from './Avatar';

function mapStates ({ authUser }) {
  return { authUser };
}

function UserAvatar (avatarProps) {
  const { authUser } = useFluxibleStore(mapStates);
  const {
    profilePicture,
    firstName,
    middleName,
    surname
  } = authUser;

  const label = (
    (firstName?.[0] || '') +
    (middleName?.[0] || '') +
    (surname?.[0] || '')
  ).toUpperCase();

  return (
    <Avatar uri={profilePicture} label={label} {...avatarProps} />
  );
}

export default React.memo(UserAvatar);
