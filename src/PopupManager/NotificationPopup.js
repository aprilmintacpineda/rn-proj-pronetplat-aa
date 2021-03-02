import React from 'react';
import { AppState, View } from 'react-native';
import { Card, Portal, Text } from 'react-native-paper';
import RNNotificationPopup from 'react-native-push-notification-popup';
import Avatar from 'components/Avatar';
import Caption from 'components/Caption';
import FullSafeAreaView from 'components/FullSafeAreaView';

const notificationPopupRef = React.createRef();

export function displayNotification (params) {
  if (
    AppState.currentState !== 'active' ||
    !notificationPopupRef.current
  )
    return;

  notificationPopupRef.current.show(params);
}

function renderPopupContent ({
  title,
  body,
  avatarUri,
  avatarLabel
}) {
  if (avatarUri || avatarLabel) {
    return (
      <FullSafeAreaView>
        <Card
          style={{
            elevation: 2,
            borderColor: '#00000012',
            borderWidth: 1
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingVertical: 15
            }}
          >
            <View style={{ paddingLeft: 15 }}>
              <Avatar
                uri={avatarUri}
                label={avatarLabel}
                size={40}
              />
            </View>
            <View style={{ flex: 1, paddingHorizontal: 15 }}>
              <Caption
                style={{ fontWeight: 'bold', marginBottom: 0 }}
              >
                {title}
              </Caption>
              <Text>{body}</Text>
            </View>
          </View>
        </Card>
      </FullSafeAreaView>
    );
  }

  return (
    <FullSafeAreaView>
      <Card
        style={{
          elevation: 2,
          padding: 15,
          borderColor: '#00000012',
          borderWidth: 1
        }}
      >
        <Caption style={{ fontWeight: 'bold', marginBottom: 0 }}>
          {title}
        </Caption>
        <Text>{body}</Text>
      </Card>
    </FullSafeAreaView>
  );
}

function NotificationPopup () {
  return (
    <Portal>
      <RNNotificationPopup
        ref={ref => (notificationPopupRef.current = ref)}
        renderPopupContent={renderPopupContent}
      />
    </Portal>
  );
}

export default React.memo(NotificationPopup);
