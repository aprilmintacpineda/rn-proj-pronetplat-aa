import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import RNVectorIcon from 'components/RNVectorIcon';
import ContactList from 'Screens/auth/Contact/List';
import MyCode from 'Screens/auth/MyCode';
import ScanCode from 'Screens/auth/ScanCode';
import SendingContactRequests from 'Screens/auth/SendingContactRequests';

const Tab = createBottomTabNavigator();

function MainTabNavigation () {
  return (
    <Tab.Navigator
      lazy={false}
      tabBarOptions={{
        labelPosition: 'below-icon',
        keyboardHidesTabBar: true
      }}
    >
      <Tab.Screen
        options={{
          tabBarIcon: props => (
            <RNVectorIcon
              provider="AntDesign"
              name="contacts"
              {...props}
            />
          ),
          tabBarLabel: 'Contacts'
        }}
        name="ContactList"
        component={ContactList}
      />
      <Tab.Screen
        options={{
          tabBarIcon: props => (
            <RNVectorIcon
              provider="Ionicons"
              name="qr-code-outline"
              {...props}
            />
          ),
          tabBarLabel: 'My Code'
        }}
        name="MyCode"
        component={MyCode}
      />
      <Tab.Screen
        options={{
          tabBarIcon: props => (
            <RNVectorIcon
              provider="Ionicons"
              name="scan-outline"
              {...props}
            />
          ),
          tabBarLabel: 'Scan Code'
        }}
        name="ScanCode"
        component={ScanCode}
      />
      <Tab.Screen
        options={{
          tabBarIcon: props => (
            <RNVectorIcon
              provider="MaterialCommunityIcons"
              name="av-timer"
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

export default React.memo(MainTabNavigation);
