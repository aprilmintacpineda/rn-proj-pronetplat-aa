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
  '{fullname}': ({ actor }) => getFullName(actor),
  '{genderPossessiveLowercase}': ({ actor }) =>
    getPersonalPronoun(actor).possessive.lowercase,
  '{eventName}': ({ payload: { event } }) => event.name,
  '{userFullNamePossessive}': ({ actor, payload: { user } }) => {
    return user.id === actor.id
      ? getPersonalPronoun(actor).possessive.lowercase
      : user.id === store.authUser.id
      ? 'your'
      : `${getFullName(user)}'s`;
  },
  '{userFullName}': ({ actor, payload: { user } }) => {
    return user.id === actor.id
      ? getPersonalPronoun(actor).possessive.lowercase
      : user.id === store.authUser.id
      ? 'you'
      : `${getFullName(user)}`;
  }
};

function NotificationBody (notification) {
  const { actor, body, createdAt, type, seenAt } = notification;
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
          ? `${paperTheme.colors.primary}40`
          : undefined
      }}
    >
      <View style={{ position: 'relative' }}>
        <UserAvatar user={actor} />
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
  const {
    type,
    actor,
    payload: { event }
  } = notification;

  switch (type) {
    case 'contactRequestAccepted':
    case 'contactRequestDeclined':
    case 'contactRequestFollowUp':
    case 'contactRequestCancelled':
      return (
        <TouchableRipple to="ContactProfile" params={actor}>
          <NotificationBody {...notification} />
        </TouchableRipple>
      );
    case 'addedAsOrganizerToEvent':
    case 'removedAsOrganizerFromEvent':
    case 'contactPublishedAnEvent':
    case 'eventInvitationAccepted':
    case 'eventInvitationRejected':
    case 'replyOnComment':
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
