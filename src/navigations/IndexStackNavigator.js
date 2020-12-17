import { TransitionPresets, createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import header from './header';
import MainDrawerNavigation from './MainDrawerNavigation';
import ForgotPassword from 'Screens/guest/ForgotPassword';
import Login from 'Screens/guest/Login';
import Register from 'Screens/guest/Register';

const Stack = createStackNavigator();

const screenOptions = {
  ...TransitionPresets.ModalSlideFromBottomIOS,
  gestureEnabled: true,
  header
};

const loginChangeStackOptions = {
  ...TransitionPresets.ScaleFromCenterAndroid,
  headerShown: false
};

function GuestStackNavigation () {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={screenOptions}
      headerMode="screen">
      <Stack.Screen name="Login" component={Login} options={loginChangeStackOptions} />
      <Stack.Screen
        name="Register"
        component={Register}
        options={{ title: 'Create Account' }}
      />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
      <Stack.Screen
        name="LoggedInStack"
        component={MainDrawerNavigation}
        options={loginChangeStackOptions}
      />
    </Stack.Navigator>
  );
}

export default React.memo(GuestStackNavigation);
