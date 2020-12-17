import { TransitionPresets, createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import header from './header';
import ForgotPassword from 'screens/guest/ForgotPassword';
import Login from 'screens/guest/Login';
import Register from 'screens/guest/Register';

const Stack = createStackNavigator();

const screenOptions = {
  ...TransitionPresets.ModalSlideFromBottomIOS,
  gestureEnabled: true,
  header
};

function GuestStackNavigation () {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={screenOptions}
      headerMode="screen">
      <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
      <Stack.Screen
        name="Register"
        component={Register}
        options={{ title: 'Create Account' }}
      />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
    </Stack.Navigator>
  );
}

export default React.memo(GuestStackNavigation);
