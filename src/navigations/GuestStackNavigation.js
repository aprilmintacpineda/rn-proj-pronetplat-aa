import { TransitionPresets, createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import Login from 'Screens/guest/Login';
import Register from 'Screens/guest/Register';

const Stack = createStackNavigator();

const screenOptions = {
  ...TransitionPresets.ModalSlideFromBottomIOS,
  gestureEnabled: true
};

function MainNavigation () {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      headerMode="none"
      screenOptions={screenOptions}>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
    </Stack.Navigator>
  );
}

export default React.memo(MainNavigation);
