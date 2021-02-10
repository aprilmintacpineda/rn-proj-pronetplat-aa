import React from 'react';
import { View } from 'react-native';
import { Paragraph, Text } from 'react-native-paper';
import Caption from 'components/Caption';
import RNVectorIcon from 'components/RNVectorIcon';
import TimeAgo from 'components/TimeAgo';
import TouchableButtonLink from 'components/TouchableButtonLink';
import UserAvatar from 'components/UserAvatar';
import { getFullName, getPersonalPronoun } from 'libs/user';
import { paperTheme, navigationTheme } from 'theme';

const { success, error, primary } = paperTheme.colors;
const { background: backgroundColor } = navigationTheme.colors;

const replacers = {
  '{fullname}': user => getFullName(user),
  '{genderPossessiveLowercase}': user =>
    getPersonalPronoun(user.gender).possessive.lowercase
};

function NotificationBody ({ actor, body, createdAt, type, seenAt }) {
  let icon = null;

  switch (type) {
    case 'contactRequestAccepted':
      icon = (
        <RNVectorIcon
          provider="MaterialCommunityIcons"
          name="account-check"
          size={25}
          color={success}
        />
      );
      break;
    case 'contactRequestDeclined':
      icon = (
        <RNVectorIcon
          provider="MaterialCommunityIcons"
          name="account-cancel"
          size={25}
          color={error}
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

        const value = replacer(actor);

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
    }, []);

    return texts;
  }, [body, actor]);

  return (
    <View
      style={{
        flexDirection: 'row',
        padding: 15,
        backgroundColor: !seenAt ? `${primary}10` : undefined
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
  const { type, actor } = notification;

  if (
    type === 'contactRequestAccepted' ||
    type === 'contactRequestDeclined' ||
    type === 'contactRequestFollowUp' ||
    type === 'contactRequestCancelled'
  ) {
    return (
      <TouchableButtonLink to="ContactProfile" params={actor}>
        <NotificationBody {...notification} />
      </TouchableButtonLink>
    );
  }

  return <NotificationBody {...notification} />;
}

export default React.memo(NotificationRow);
