import {
  TransitionPresets,
  createStackNavigator
} from '@react-navigation/stack';
import React from 'react';
import { Platform, View } from 'react-native';
import { Appbar, Text } from 'react-native-paper';
import header from './header';
import LoggedInTabNavigation from './LoggedInTabNavigation';
import Avatar from 'components/Avatar';
import RNVectorIcon from 'components/RNVectorIcon';
import { getFullName } from 'libs/user';
import About from 'Screens/auth/About';
import BlockList from 'Screens/auth/BlockList';
import ChangePassword from 'Screens/auth/ChangePassword';
import ChangePersonalInfo from 'Screens/auth/ChangePersonalInfo';
import ContactChat from 'Screens/auth/Contact/Chat';
import ContactProfile from 'Screens/auth/Contact/Profile';
import ContactDetailsForm from 'Screens/auth/ContactDetail/ContactDetailsForm';
import ContactDetailsList from 'Screens/auth/ContactDetail/List';
import ContactRequests from 'Screens/auth/ContactRequests';
import CreateEvent from 'Screens/auth/Events/Create';
import EventsList from 'Screens/auth/Events/List';
import ViewEvent from 'Screens/auth/Events/View';
import Notifications from 'Screens/auth/Notifications';
import PrivacySettings from 'Screens/auth/PrivacySettings';
import SearchUsers from 'Screens/auth/SearchUsers';
import Settings from 'Screens/auth/Settings';

const Stack = createStackNavigator();

function resolveContactChatTitleBar (contact) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center'
      }}
    >
      <Avatar size={40} uri={contact.profilePicture} />
      <Text
        style={{
          marginLeft: 10,
          color: '#fff',
          fontSize: Platform.select({
            ios: 17,
            android: 20
          }),
          flex: 1
        }}
        numberOfLines={1}
      >
        {getFullName(contact)}
      </Text>
    </View>
  );
}

function resolveViewEventTitleBar (event) {
  return event.name;
}

function resolveContactProfileTitleBar (contact) {
  return getFullName(contact);
}

function resolveContactDetailsFormTitleBar (contactDetail) {
  if (!contactDetail) return 'Add contact detail';
  return 'Edit contact detail';
}

const modalConfiguration = {
  ...TransitionPresets.ModalSlideFromBottomIOS,
  isModal: true
};

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
          resolveAppBarContent: resolveContactProfileTitleBar
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
          resolveAppBarContent: resolveContactDetailsFormTitleBar,
          ...modalConfiguration
        }}
      />
      <Stack.Screen
        name="ContactRequests"
        component={ContactRequests}
        options={{
          title: 'Contact Requests',
          ...modalConfiguration
        }}
      />
      <Stack.Screen
        name="Notifications"
        component={Notifications}
        options={{
          title: 'Notifications',
          ...modalConfiguration
        }}
      />
      <Stack.Screen
        name="Settings"
        component={Settings}
        options={{
          title: 'Settings',
          ...modalConfiguration
        }}
      />
      <Stack.Screen
        name="About"
        component={About}
        options={{
          title: 'About',
          ...modalConfiguration
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
      <Stack.Screen
        name="ContactChat"
        component={ContactChat}
        options={{
          resolveAppBarContent: resolveContactChatTitleBar
        }}
      />
      <Stack.Screen
        name="MyEvents"
        component={EventsList}
        options={{
          title: 'Your events',
          ...modalConfiguration
        }}
      />
      <Stack.Screen
        name="CreateEvent"
        component={CreateEvent}
        options={{
          title: 'Create Event',
          ...modalConfiguration
        }}
      />
      <Stack.Screen
        name="ViewEvent"
        component={ViewEvent}
        options={{
          resolveAppBarContent: resolveViewEventTitleBar
        }}
      />
    </Stack.Navigator>
  );
}

export default React.memo(LoggedInStackNavigation);
