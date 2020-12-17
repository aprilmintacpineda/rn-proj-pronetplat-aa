import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Tab = createBottomTabNavigator();

import ContactList from 'Screens/auth/Contact/List';
import MyCode from 'Screens/auth/MyCode';
import ScanCode from 'Screens/auth/ScanCode';

function MainTabNavigation () {
  return (
    <Tab.Navigator
      tabBarOptions={{
        labelPosition: 'below-icon',
        keyboardHidesTabBar: true
      }}>
      <Tab.Screen
        options={{
          tabBarIcon: props => <AntDesign name="contacts" {...props} />,
          tabBarLabel: 'Contacts'
        }}
        name="ContactList"
        component={ContactList}
      />
      <Tab.Screen
        options={{
          tabBarIcon: props => <Ionicons name="qr-code-outline" {...props} />,
          tabBarLabel: 'My Code'
        }}
        name="MyCode"
        component={MyCode}
      />
      <Tab.Screen
        options={{
          tabBarIcon: props => <Ionicons name="scan-outline" {...props} />,
          tabBarLabel: 'Scan Code'
        }}
        name="ScanCode"
        component={ScanCode}
      />
    </Tab.Navigator>
  );
}

export default React.memo(MainTabNavigation);
