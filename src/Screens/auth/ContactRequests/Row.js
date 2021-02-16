import React from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import Animatable from 'components/Animatable';
import Caption from 'components/Caption';
import TimeAgo from 'components/TimeAgo';
import TouchableRipple from 'components/TouchableRipple';
import UserAvatar from 'components/UserAvatar';
import { getFullName, renderUserTitle } from 'libs/user';

function ContactRequestRow ({ sender, createdAt, index }) {
  const fullName = getFullName(sender);
  const delay = (index % 10) * 100;

  return (
    <Animatable animation="fadeInFromRight" delay={delay}>
      <TouchableRipple to="ContactProfile" params={sender}>
        <View style={{ flexDirection: 'row', padding: 15 }}>
          <UserAvatar user={sender} />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text numberOfLines={1} style={{ fontSize: 18 }}>
              {fullName}
            </Text>
            {renderUserTitle(sender)}
            <Caption>
              <TimeAgo dateFrom={createdAt} />
            </Caption>
          </View>
        </View>
      </TouchableRipple>
    </Animatable>
  );
}

export default React.memo(ContactRequestRow);
