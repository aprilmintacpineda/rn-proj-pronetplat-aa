import React from 'react';
import Avatar from './Avatar';
import { getInitials } from 'libs/contact';

function UserAvatar ({ user, ...avatarProps }) {
  return (
    <Avatar
      {...avatarProps}
      uri={user.profilePicture}
      label={getInitials(user)}
    />
  );
}

export default React.memo(UserAvatar);
