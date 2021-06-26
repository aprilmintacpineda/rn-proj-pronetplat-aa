import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import useFluxibleStore from 'react-fluxible/lib/useFluxibleStore';
import RNVectorIcon from 'components/RNVectorIcon';
import ContactList from 'Screens/auth/Contact/List';
import Inbox from 'Screens/auth/Inbox';
import MyCode from 'Screens/auth/MyCode';
import ScanCode from 'Screens/auth/ScanCode';
import SendingContactRequests from 'Screens/auth/SendingContactRequests';
import { paperTheme } from 'theme';

const Tab = createBottomTabNavigator();

function mapStates ({ sendingContactRequests, authUser }) {
  return { sendingContactRequests, authUser };
}

function LoggedInTabNavigation () {
  const { sendingContactRequests, authUser } =
    useFluxibleStore(mapStates);

  return (
    <Tab.Navigator
      lazy={false}
      tabBarOptions={{
        labelPosition: 'below-icon',
        keyboardHidesTabBar: true,
        inactiveTintColor: paperTheme.colors.accent
      }}
    >
      <Tab.Screen
        options={{
          tabBarIcon: props => (
            <RNVectorIcon
              provider="Ionicons"
              name="ios-people-outline"
              {...props}
            />
          ),
          tabBarLabel: 'My Contacts'
        }}
        name="ContactList"
        component={ContactList}
      />
      <Tab.Screen
        options={{
          tabBarIcon: props => (
            <RNVectorIcon
              provider="Ionicons"
              name="ios-chatbubbles-outline"
              badge={authUser.unreadChatMessagesCount}
              {...props}
            />
          ),
          tabBarLabel: 'My Inbox'
        }}
        name="Inbox"
        component={Inbox}
      />
      <Tab.Screen
        options={{
          tabBarIcon: props => (
            <RNVectorIcon
              provider="MaterialCommunityIcons"
              name="qrcode"
              {...props}
            />
          ),
          tabBarLabel: 'My QRCode'
        }}
        name="MyCode"
        component={MyCode}
      />
      <Tab.Screen
        options={{
          tabBarIcon: props => (
            <RNVectorIcon
              provider="MaterialCommunityIcons"
              name="qrcode-scan"
              {...props}
            />
          ),
          tabBarLabel: 'Scan QRCode'
        }}
        name="ScanCode"
        component={ScanCode}
      />
      <Tab.Screen
        options={{
          tabBarIcon: props => (
            <RNVectorIcon
              provider="MaterialCommunityIcons"
              name="progress-upload"
              badge={sendingContactRequests.length}
              {...props}
            />
          ),
          tabBarLabel: 'Pending'
        }}
        name="SendingContactRequests"
        component={SendingContactRequests}
      />
    </Tab.Navigator>
  );
}

export default React.memo(LoggedInTabNavigation);
