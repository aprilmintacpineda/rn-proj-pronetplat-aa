import React from 'react';
import { View } from 'react-native';
import { Text, TouchableRipple } from 'react-native-paper';
import Avatar from 'components/Avatar';
import Button from 'components/Button';
import Caption from 'components/Caption';
import TimeAgo from 'components/TimeAgo';
import { showPopup } from 'fluxible/actions/popup';
import { renderContactTitle } from 'helpers/contact';
import { paperTheme } from 'theme';

const { rippleColor, primary } = paperTheme.colors;

export function showContactRequestPopup ({ sender }) {
  const { profilePicture, firstName, middleName, surname, bio } = sender;
  const avatarLabel = (firstName[0] + (middleName?.[0] || '') + surname[0]).toUpperCase();
  const fullName = `${firstName}${middleName ? ` ${middleName} ` : ' '}${surname}`;

  showPopup(
    <View style={{ marginVertical: 30, marginHorizontal: 20 }}>
      <View style={{ alignItems: 'center' }}>
        <Avatar size={120} label={avatarLabel} uri={profilePicture} />
        <Text numberOfLines={1} style={{ fontSize: 18, marginTop: 10 }}>
          {fullName}
        </Text>
        {renderContactTitle(sender)}
        <Text style={{ textAlign: 'center', marginTop: 10, marginBottom: 30 }}>
          {bio}
        </Text>
      </View>
      <View>
        <Button mode="contained" color={primary} style={{ marginBottom: 10 }}>
          Accept
        </Button>
        <Button mode="outlined" color={primary}>
          Decline
        </Button>
      </View>
    </View>
  );
}

function ContactRequestRow (contactRequest) {
  const openPopup = React.useCallback(() => {
    showContactRequestPopup(contactRequest);
  }, [contactRequest]);

  const { sender, createdAt } = contactRequest;
  const { profilePicture, firstName, middleName, surname } = sender;
  const avatarLabel = (firstName[0] + (middleName?.[0] || '') + surname[0]).toUpperCase();
  const fullName = `${firstName}${middleName ? ` ${middleName} ` : ' '}${surname}`;

  return (
    <TouchableRipple rippleColor={rippleColor} onPress={openPopup}>
      <View style={{ flexDirection: 'row', padding: 15 }}>
        <Avatar uri={profilePicture} label={avatarLabel} />
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text numberOfLines={1} style={{ fontSize: 18 }}>
            {fullName}
          </Text>
          {renderContactTitle(sender)}
          <Caption>
            <TimeAgo dateFrom={createdAt} />
          </Caption>
        </View>
      </View>
    </TouchableRipple>
  );
}

export default React.memo(ContactRequestRow);
