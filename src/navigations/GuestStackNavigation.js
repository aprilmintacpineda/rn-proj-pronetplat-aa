import { TransitionPresets, createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import header from './header';
import Login from 'Screens/guest/Login';
import Register from 'Screens/guest/Register';

const Stack = createStackNavigator();

const screenOptions = {
  ...TransitionPresets.ModalSlideFromBottomIOS,
  gestureEnabled: true,
  header
};

function MainNavigation () {
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
    </Stack.Navigator>
  );
}

export default React.memo(MainNavigation);
