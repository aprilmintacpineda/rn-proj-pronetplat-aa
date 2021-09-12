import Color from 'color';
import { store } from 'fluxible-js';
import React from 'react';
import { View } from 'react-native';
import { Paragraph } from 'react-native-paper';
import Caption from 'components/Caption';
import RNVectorIcon from 'components/RNVectorIcon';
import TimeAgo from 'components/TimeAgo';
import TouchableRipple from 'components/TouchableRipple';
import UserAvatar from 'components/UserAvatar';
import { replacePlaceholders } from 'libs/strings';
import { getFullName, getPersonalPronoun } from 'libs/user';
import { paperTheme, navigationTheme } from 'theme';

const { error, primary } = paperTheme.colors;
const { background: backgroundColor } = navigationTheme.colors;

const replacers = {
  '{fullname}': ({ user }) => getFullName(user),
  '{genderPossessiveLowercase}': ({ user }) =>
    getPersonalPronoun(user).possessive.lowercase,
  '{eventName}': ({ event }) => event.name,
  '{userFullNamePossessive}': notif => {
    console.log(notif);

    const {
      user,
      payload: { userId }
    } = notif;

    return userId === user.id
      ? getPersonalPronoun(user).possessive.lowercase
      : userId === store.authUser.id
      ? 'your'
      : `${getFullName(user)}'s`;
  }
};

function NotificationBody (notification) {
  const { user, body, createdAt, type, seenAt } = notification;
  let icon = null;

  switch (type) {
    case 'contactRequestAccepted':
      icon = (
        <RNVectorIcon
          provider="MaterialCommunityIcons"
          name="account-check-outline"
          size={25}
          color={primary}
        />
      );
      break;
    case 'contactRequestCancelled':
    case 'contactRequestDeclined':
      icon = (
        <RNVectorIcon
          provider="MaterialCommunityIcons"
          name="account-cancel-outline"
          size={25}
          color={error}
        />
      );
      break;
    case 'contactRequestFollowUp':
      icon = (
        <RNVectorIcon
          provider="MaterialCommunityIcons"
          name="account-alert-outline"
          size={25}
          color={primary}
        />
      );
      break;
    case 'addedAsOrganizerToEvent':
    case 'removedAsOrganizerFromEvent':
      icon = (
        <RNVectorIcon
          provider="MaterialCommunityIcons"
          name="calendar-account-outline"
          size={25}
          color={primary}
        />
      );
      break;
  }

  const notificationBody = React.useMemo(
    () => replacePlaceholders(body, replacers, notification),
    [body, notification]
  );

  return (
    <View
      style={{
        flexDirection: 'row',
        padding: 15,
        backgroundColor: !seenAt
          ? Color(paperTheme.colors.primary).alpha(0.12).toString()
          : undefined
      }}
    >
      <View style={{ position: 'relative' }}>
        <UserAvatar user={user} />
        <View
          style={{
            position: 'absolute',
            bottom: -5,
            right: -5,
            backgroundColor,
            borderRadius: 100
          }}
        >
          {icon}
        </View>
      </View>
      <View style={{ marginLeft: 10, flex: 1 }}>
        <Paragraph>{notificationBody}</Paragraph>
        <Caption>
          <TimeAgo dateFrom={createdAt} />
        </Caption>
      </View>
    </View>
  );
}

function NotificationRow (notification) {
  const { type, user, event } = notification;

  switch (type) {
    case 'contactRequestAccepted':
    case 'contactRequestDeclined':
    case 'contactRequestFollowUp':
    case 'contactRequestCancelled':
      return (
        <TouchableRipple to="ContactProfile" params={user}>
          <NotificationBody {...notification} />
        </TouchableRipple>
      );
    case 'addedAsOrganizerToEvent':
    case 'removedAsOrganizerFromEvent':
    case 'contactPublishedAnEvent':
    case 'eventInvitationAccepted':
    case 'eventInvitationRejected':
      return (
        <TouchableRipple to="ViewEvent" params={event}>
          <NotificationBody {...notification} />
        </TouchableRipple>
      );
    default:
      return <NotificationBody {...notification} />;
  }
}

export default React.memo(NotificationRow);
