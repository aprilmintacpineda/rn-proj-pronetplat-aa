import {
  TransitionPresets,
  createStackNavigator
} from '@react-navigation/stack';
import React from 'react';
import { Appbar } from 'react-native-paper';
import header from './header';
import LoggedInTabNavigation from './LoggedInTabNavigation';
import RNVectorIcon from 'components/RNVectorIcon';
import About from 'Screens/auth/About';
import BlockList from 'Screens/auth/BlockList';
import ChangePassword from 'Screens/auth/ChangePassword';
import ChangePersonalInfo from 'Screens/auth/ChangePersonalInfo';
import ContactProfile from 'Screens/auth/Contact/Profile';
import ContactDetailsForm from 'Screens/auth/ContactDetail/ContactDetailsForm';
import ContactDetailsList from 'Screens/auth/ContactDetail/List';
import ContactRequests from 'Screens/auth/ContactRequests';
import Notifications from 'Screens/auth/Notifications';
import PrivacySettings from 'Screens/auth/PrivacySettings';
import SearchUsers from 'Screens/auth/SearchUsers';
import Settings from 'Screens/auth/Settings';

const Stack = createStackNavigator();

const screenOptions = {
  header,
  ...TransitionPresets.SlideFromRightIOS,
  gestureEnabled: true
};

function searchIcon (props) {
  return (
    <RNVectorIcon
      {...props}
      provider="Ionicons"
      name="search-outline"
    />
  );
}

function LoggedInStackNavigation ({ navigation: { navigate } }) {
  const searchUsers = React.useCallback(() => {
    navigate('SearchUsers');
  }, [navigate]);

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
          title: 'Dashboard',
          button: (
            <Appbar.Action icon={searchIcon} onPress={searchUsers} />
          )
        }}
      />
      <Stack.Screen
        name="ContactProfile"
        component={ContactProfile}
        options={{
          title: ''
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
      <Stack.Screen
        name="SearchUsers"
        component={SearchUsers}
        options={{
          title: 'Search users',
          headerShown: false
        }}
      />
      <Stack.Screen
        name="PrivacySettings"
        component={PrivacySettings}
        options={{
          title: 'Privacy settings'
        }}
      />
    </Stack.Navigator>
  );
}

export default React.memo(LoggedInStackNavigation);
