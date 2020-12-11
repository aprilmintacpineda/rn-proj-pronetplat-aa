import { TransitionPresets, createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { Appbar } from 'react-native-paper';

import MainTabNavigation from './MainTabNavigation';
import ContactProfile from 'Screens/auth/Contact/Profile';

const Stack = createStackNavigator();

function header (props) {
  const { scene, navigation } = props;
  const { goBack, canGoBack } = navigation;
  const { isMainScreen, title } = scene.descriptor.options;

  return (
    <Appbar.Header
      style={{
        backgroundColor: '#fff',
        elevation: 2
      }}>
      {!isMainScreen && canGoBack() ? <Appbar.BackAction onPress={goBack} /> : null}
      <Appbar.Content
        title={title}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          alignItems: 'center',
          zIndex: -1,
          marginLeft: 0
        }}
      />
    </Appbar.Header>
  );
}

const screenOptions = {
  header,
  ...TransitionPresets.SlideFromRightIOS,
  gestureEnabled: true
};

function MainNavigation () {
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
          headerShown: false
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

export default React.memo(MainNavigation);
