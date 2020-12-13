import { createDrawerNavigator } from '@react-navigation/drawer';
import React from 'react';
import { Drawer as RNPDrawer } from 'react-native-paper';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import useWindowDimensions from 'react-native/Libraries/Utilities/useWindowDimensions';
import MainStackNavigation from './MainStackNavigation';
import { logout } from 'fluxible/actions/user';

const Drawer = createDrawerNavigator();

function drawerContent (props) {
  const { state, descriptors, navigation } = props;
  const { routes, index } = state;
  const { navigate } = navigation;

  const drawerItems = routes.map(({ key, name }, i) => {
    const { options } = descriptors[key];
    const { title, drawerIcon } = options;

    return (
      <RNPDrawer.Item
        key={key}
        onPress={() => {
          navigate(name);
        }}
        label={title}
        icon={drawerIcon}
        active={index === i}
      />
    );
  });

  return (
    <>
      {drawerItems}
      <RNPDrawer.Item
        onPress={logout}
        label="Logout"
        icon={props => <AntDesign name="logout" {...props} />}
      />
    </>
  );
}

function MainDrawerNavigation () {
  const { width } = useWindowDimensions();

  const drawerType = width >= 768 ? 'permanent' : 'slide';

  return (
    <Drawer.Navigator
      initialRouteName="MainStackNavigation"
      drawerType={drawerType}
      drawerContent={drawerContent}>
      <Drawer.Screen
        name="MainStackNavigation"
        component={MainStackNavigation}
        options={{
          title: 'Dashboard',
          drawerIcon: props => <MaterialCommunityIcons name="view-dashboard" {...props} />
        }}
      />
    </Drawer.Navigator>
  );
}

export default React.memo(MainDrawerNavigation);
