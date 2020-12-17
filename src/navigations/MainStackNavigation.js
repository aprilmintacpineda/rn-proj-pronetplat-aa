import { TransitionPresets, createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import header from './header';
import MainTabNavigation from './MainTabNavigation';
import ContactProfile from 'screens/auth/Contact/Profile';

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
      screenOptions={screenOptions}>
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
    </Stack.Navigator>
  );
}

export default React.memo(MainStackNavigation);
