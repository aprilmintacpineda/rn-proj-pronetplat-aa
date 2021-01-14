import React from 'react';
import { View } from 'react-native';
import { Paragraph, Text } from 'react-native-paper';
import Avatar from 'components/Avatar';
import Caption from 'components/Caption';
import RNVectorIcon from 'components/RNVectorIcon';
import TimeAgo from 'components/TimeAgo';
import TouchableButtonLink from 'components/TouchableButtonLink';
import { getFullName, getInitials } from 'helpers/contact';
import { paperTheme, navigationTheme } from 'theme';

const { success, error, primary } = paperTheme.colors;
const { background: backgroundColor } = navigationTheme.colors;

function NotificationBody ({ actor, body, createdAt, type, seenAt }) {
  const { profilePicture } = actor;
  const fullname = getFullName(actor);
  const avatarLabel = getInitials(actor);
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
      if (/{fullname}/.test(word)) {
        if (currentText) {
          texts.push(<Text>{currentText}</Text>);
          currentText = '';
        }

        texts.push(
          <Text style={{ fontWeight: 'bold' }}>{fullname}</Text>
        );
      } else if (wordsLastIndex === index) {
        texts.push(
          <Text>
            {currentText} {word}
          </Text>
        );
      } else {
        currentText += ` ${word}`;
      }
    }, []);

    return texts;
  }, [body, fullname]);

  return (
    <View
      style={{
        flexDirection: 'row',
        padding: 15,
        backgroundColor: !seenAt ? `${primary}10` : undefined
      }}
    >
      <View style={{ position: 'relative' }}>
        <Avatar uri={profilePicture} label={avatarLabel} />
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
    type === 'contactRequestDeclined'
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
