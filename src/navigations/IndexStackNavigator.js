import {
  TransitionPresets,
  createStackNavigator
} from '@react-navigation/stack';
import React from 'react';
import useFluxibleStore from 'react-fluxible/lib/useFluxibleStore';
import header from './header';
import MainDrawerNavigation from './MainDrawerNavigation';
import ForgotPassword from 'Screens/guest/ForgotPassword';
import Login from 'Screens/guest/Login';
import ReAuth from 'Screens/guest/ReAuth';
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

function mapStates ({ authUser, reAuth }) {
  return { authUser, reAuth };
}

function IndexStackNavigator () {
  const { authUser, reAuth } = useFluxibleStore(mapStates);
  const initialRouteName = reAuth
    ? 'ReAuth'
    : authUser
    ? 'LoggedInRoutes'
    : 'Login';

  return (
    <Stack.Navigator
      initialRouteName={initialRouteName}
      screenOptions={screenOptions}
      headerMode="screen"
    >
      <Stack.Screen
        name="Login"
        component={Login}
        options={loginChangeStackOptions}
      />
      <Stack.Screen
        name="ReAuth"
        component={ReAuth}
        options={loginChangeStackOptions}
      />
      <Stack.Screen
        name="Register"
        component={Register}
        options={{ title: 'Create Account' }}
      />
      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPassword}
      />
      <Stack.Screen
        name="LoggedInRoutes"
        component={MainDrawerNavigation}
        options={loginChangeStackOptions}
      />
    </Stack.Navigator>
  );
}

export default React.memo(IndexStackNavigator);
