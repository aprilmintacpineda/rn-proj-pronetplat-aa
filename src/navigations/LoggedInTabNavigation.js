import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import useFluxibleStore from 'react-fluxible/lib/useFluxibleStore';
import RNVectorIcon from 'components/RNVectorIcon';
import ContactList from 'Screens/auth/Contact/List';
import MyCode from 'Screens/auth/MyCode';
import ScanCode from 'Screens/auth/ScanCode';
import SendingContactRequests from 'Screens/auth/SendingContactRequests';

const Tab = createBottomTabNavigator();

function mapStates ({ sendingContactRequests }) {
  return { sendingContactRequests };
}

function LoggedInTabNavigation () {
  const { sendingContactRequests } = useFluxibleStore(mapStates);

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
              provider="Feather"
              name="user-check"
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
              {...props}
              badge={sendingContactRequests.length}
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
