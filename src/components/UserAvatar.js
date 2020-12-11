import React from 'react';
import { Avatar } from 'react-native-paper';

function UserAvatar ({
  profilePicture,
  firstName,
  middleName = null,
  lastName,
  size = 60
}) {
  if (profilePicture)
    return <Avatar.Image source={{ uri: profilePicture }} size={size} />;

  const avatarLabel = (
    firstName[0] +
    (middleName?.[0] || '') +
    lastName[0]
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
