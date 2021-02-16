import messaging from '@react-native-firebase/messaging';
import {
  TransitionPresets,
  createStackNavigator
} from '@react-navigation/stack';
import { store, updateStore } from 'fluxible-js';
import React from 'react';
import { AppState } from 'react-native';
import header from './header';
import MainTabNavigation from './MainTabNavigation';
import { navigationRef } from 'App';
import { getInitials } from 'libs/user';
import { displayNotification } from 'PopupManager/NotificationPopup';
import BlockList from 'Screens/auth/BlockList';
import ContactProfile from 'Screens/auth/Contact/Profile';
import ContactRequests from 'Screens/auth/ContactRequests';
import Notifications from 'Screens/auth/Notifications';
import Settings from 'Screens/auth/Settings';

const Stack = createStackNavigator();

const screenOptions = {
  header,
  ...TransitionPresets.SlideFromRightIOS,
  gestureEnabled: true
};

function MainStackNavigation () {
  React.useEffect(() => {
    let unsubscribe = null;

    (async () => {
      const openedNotif = await messaging().getInitialNotification();
      console.log('openedNotif', openedNotif);

      const wasNotifAuthorized = await messaging().requestPermission();

      if (wasNotifAuthorized) {
        unsubscribe = messaging().onMessage(async remoteMessage => {
          console.log('onMessage', remoteMessage);

          if (!store.authUser || AppState.currentState !== 'active')
            return;

          const { data, notification } = remoteMessage;
          const { title, body } = notification;
          const { type, category, profilePicture } = data;

          const screensByType = {
            contactRequest: 'ContactProfile',
            contactRequestAccepted: 'ContactProfile',
            contactRequestCancelled: 'ContactProfile',
            contactRequestDeclined: 'ContactProfile'
          };

          switch (category) {
            case 'contactRequest':
              updateStore({
                authUser: {
                  ...store.authUser,
                  receivedContactRequestsCount:
                    store.authUser.receivedContactRequestsCount + 1
                }
              });
              break;
            case 'notification':
              updateStore({
                authUser: {
                  ...store.authUser,
                  notificationsCount:
                    store.authUser.notificationsCount + 1
                }
              });
              break;
          }

          displayNotification({
            title,
            body,
            avatarUri: profilePicture,
            avatarLabel: getInitials(data),
            onPress: () => {
              const targetScreen = screensByType[type];
              if (targetScreen)
                navigationRef.current.navigate(targetScreen, data);
            }
          });
        });
      }
    })();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  return (
    <Stack.Navigator
      initialRouteName="MainTabNavigation"
      headerMode="screen"
      screenOptions={screenOptions}
    >
      <Stack.Screen
        name="MainTabNavigation"
        component={MainTabNavigation}
        options={{
          isMainScreen: true,
          title: ''
        }}
      />
      <Stack.Screen
        name="ContactProfile"
        component={ContactProfile}
        options={{
          title: 'Contact'
        }}
      />
      <Stack.Screen
        name="BlockList"
        component={BlockList}
        options={{
          title: 'Blocked Users'
        }}
      />
      <Stack.Screen
        name="ContactRequests"
        component={ContactRequests}
        options={{
          title: 'Contact Requests',
          ...TransitionPresets.ModalSlideFromBottomIOS
        }}
      />
      <Stack.Screen
        name="Notifications"
        component={Notifications}
        options={{
          title: 'Notifications',
          ...TransitionPresets.ModalSlideFromBottomIOS
        }}
      />
      <Stack.Screen
        name="Settings"
        component={Settings}
        options={{
          title: 'Settings',
          ...TransitionPresets.ModalSlideFromBottomIOS
        }}
      />
    </Stack.Navigator>
  );
}

export default React.memo(MainStackNavigation);
