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
import Register from 'Screens/guest/Register';

const Stack = createStackNavigator();

const screenOptions = {
  ...TransitionPresets.ModalSlideFromBottomIOS,
  gestureEnabled: true,
  header,
  headerMode: 'screen'
};

const loginChangeStackOptions = {
  ...TransitionPresets.ScaleFromCenterAndroid,
  headerShown: false
};

function mapStates ({ authUser }) {
  return { authUser };
}

function IndexStackNavigator () {
  const { authUser } = useFluxibleStore(mapStates);

  return (
    <Stack.Navigator
      initialRouteName={authUser ? 'LoggedInRoutes' : 'Login'}
      screenOptions={screenOptions}
    >
      <Stack.Screen
        name="Login"
        component={Login}
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
