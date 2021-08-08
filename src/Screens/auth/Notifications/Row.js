import Color from 'color';
import React from 'react';
import { View } from 'react-native';
import { Paragraph, Text } from 'react-native-paper';
import Caption from 'components/Caption';
import RNVectorIcon from 'components/RNVectorIcon';
import TimeAgo from 'components/TimeAgo';
import TouchableRipple from 'components/TouchableRipple';
import UserAvatar from 'components/UserAvatar';
import { getFullName, getPersonalPronoun } from 'libs/user';
import { paperTheme, navigationTheme } from 'theme';

const { error, primary } = paperTheme.colors;
const { background: backgroundColor } = navigationTheme.colors;

const replacers = {
  '{fullname}': ({ user }) => getFullName(user),
  '{genderPossessiveLowercase}': ({ user }) =>
    getPersonalPronoun(user.gender).possessive.lowercase,
  '{eventName}': ({ event }) => event.name
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

  const notificationBody = React.useMemo(() => {
    const texts = [];

    let currentText = '';
    const words = body.split(' ');
    const wordsLastIndex = words.length - 1;

    words.forEach((word, index) => {
      const replacer = replacers[word];

      if (replacer) {
        if (currentText) {
          texts.push(
            <Text key={`${index}-${word}-${currentText}`}>
              {currentText}{' '}
            </Text>
          );

          currentText = '';
        }

        const value = replacer(notification);

        texts.push(
          <Text
            key={`${index}-${word}-${value}`}
            style={
              word === '{fullname}' ? { fontWeight: 'bold' } : null
            }
          >
            {value}
          </Text>
        );
      } else if (wordsLastIndex === index) {
        texts.push(
          <Text key={`${index}-${currentText}-${word}`}>
            {currentText} {word}
          </Text>
        );
      } else {
        currentText += ` ${word}`;
      }
    });

    return texts;
  }, [body, notification]);

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
