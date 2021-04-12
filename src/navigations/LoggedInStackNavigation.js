import messaging from '@react-native-firebase/messaging';
import {
  TransitionPresets,
  createStackNavigator
} from '@react-navigation/stack';
import { store } from 'fluxible-js';
import React from 'react';
import { AppState } from 'react-native';
import header from './header';
import LoggedInTabNavigation from './LoggedInTabNavigation';
import { navigationRef } from 'App';
import {
  decrementContactRequestsCount,
  incrementContactRequestsCount,
  incrementNotificationsCount
} from 'fluxible/actions/user';
import { getInitials } from 'libs/user';
import { displayNotification } from 'PopupManager/NotificationPopup';
import About from 'Screens/auth/About';
import BlockList from 'Screens/auth/BlockList';
import ChangePassword from 'Screens/auth/ChangePassword';
import ChangePersonalInfo from 'Screens/auth/ChangePersonalInfo';
import ContactProfile from 'Screens/auth/Contact/Profile';
import ContactDetailsForm from 'Screens/auth/ContactDetail/ContactDetailsForm';
import ContactDetailsList from 'Screens/auth/ContactDetail/List';
import ContactRequests from 'Screens/auth/ContactRequests';
import Notifications from 'Screens/auth/Notifications';
import Settings from 'Screens/auth/Settings';

const Stack = createStackNavigator();

const screenOptions = {
  header,
  ...TransitionPresets.SlideFromRightIOS,
  gestureEnabled: true
};

function LoggedInStackNavigation () {
  React.useEffect(() => {
    let unsubscribe = null;

    (async () => {
      const openedNotif = await messaging().getInitialNotification();
      console.log('openedNotif', openedNotif);

      const wasNotifAuthorized = await messaging().requestPermission();

      if (wasNotifAuthorized) {
        unsubscribe = messaging().onMessage(async remoteMessage => {
          console.log('onMessage', remoteMessage);

          if (!store.authUser) return;

          const { data, notification } = remoteMessage;
          const { title, body } = notification;
          const { type, category, profilePicture } = data;

          if (type === 'contactRequestCancelled')
            decrementContactRequestsCount();
          else if (type === 'contactRequest')
            incrementContactRequestsCount();

          if (category === 'notification')
            incrementNotificationsCount();

          if (AppState.currentState !== 'active') return;

          displayNotification({
            title,
            body,
            avatarUri: profilePicture,
            avatarLabel: getInitials(data),
            onPress: () => {
              const screensByType = {
                contactRequest: 'ContactProfile',
                contactRequestAccepted: 'ContactProfile',
                contactRequestCancelled: 'ContactProfile',
                contactRequestDeclined: 'ContactProfile'
              };

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
      initialRouteName="LoggedInTabNavigation"
      headerMode="screen"
      screenOptions={screenOptions}
    >
      <Stack.Screen
        name="LoggedInTabNavigation"
        component={LoggedInTabNavigation}
        options={{
          isMainScreen: true,
          title: 'Dashboard'
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
        name="ChangePersonalInfo"
        component={ChangePersonalInfo}
        options={{
          title: 'Change My Personal Info'
        }}
      />
      <Stack.Screen
        name="ChangePassword"
        component={ChangePassword}
        options={{
          title: 'Change My Password'
        }}
      />
      <Stack.Screen
        name="ContactDetails"
        component={ContactDetailsList}
        options={{
          title: 'My Contact Details'
        }}
      />
      <Stack.Screen
        name="ContactDetailsForm"
        component={ContactDetailsForm}
        options={{
          title: ''
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
      <Stack.Screen
        name="About"
        component={About}
        options={{
          title: 'About',
          ...TransitionPresets.ModalSlideFromBottomIOS
        }}
      />
    </Stack.Navigator>
  );
}

export default React.memo(LoggedInStackNavigation);
