import {
  TransitionPresets,
  createStackNavigator
} from '@react-navigation/stack';
import React from 'react';
import header from './header';
import MainTabNavigation from './MainTabNavigation';
import BlockList from 'Screens/auth/BlockList';
import ContactProfile from 'Screens/auth/Contact/Profile';
import ContactRequests from 'Screens/auth/ContactRequests';
import Notifications from 'Screens/auth/Notifications';

const Stack = createStackNavigator();

const screenOptions = {
  header,
  ...TransitionPresets.SlideFromRightIOS,
  gestureEnabled: true
};

function MainStackNavigation () {
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
        name="BlockList"
        component={BlockList}
        options={{
          title: 'Blocked Users',
          ...TransitionPresets.ModalSlideFromBottomIOS
        }}
      />
    </Stack.Navigator>
  );
}

export default React.memo(MainStackNavigation);
