import messaging from '@react-native-firebase/messaging';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { updateStore } from 'fluxible-js';
import React from 'react';
import useFluxibleStore from 'react-fluxible/lib/useFluxibleStore';
import { Drawer as RNPDrawer } from 'react-native-paper';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import useWindowDimensions from 'react-native/Libraries/Utilities/useWindowDimensions';
import MainStackNavigation from './MainStackNavigation';
import { logout } from 'fluxible/actions/user';
import FirstSetup from 'Screens/auth/FirstSetup';

const Drawer = createDrawerNavigator();

function clearPendingConnections () {
  updateStore({ pendingConnections: [] });
}

function drawerContent (props) {
  const { state, descriptors, navigation } = props;
  const { routes, index } = state;
  const { navigate } = navigation;

  const drawerItems = routes.map(({ key, name }, i) => {
    const { options } = descriptors[key];
    const { title, drawerIcon, isHidden } = options;

    if (isHidden) return null;

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
        onPress={clearPendingConnections}
        label="Clear Pending Connections"
      />
      <RNPDrawer.Item
        onPress={logout}
        label="Logout"
        icon={props => <AntDesign name="logout" {...props} />}
      />
    </>
  );
}

const screenOptions = {
  swipeEnabled: false
};

function mapStates ({ authUser }) {
  return { authUser };
}

function MainDrawerNavigation ({ navigation: { replace } }) {
  const { authUser } = useFluxibleStore(mapStates);
  const { width } = useWindowDimensions();

  React.useEffect(() => {
    if (!authUser) replace('Login');
  }, [authUser, replace]);

  React.useEffect(() => {
    (async () => {
      const openedNotif = await messaging().getInitialNotification();
      console.log('openedNotif', openedNotif);

      await messaging().requestPermission();
    })();
  }, []);

  if (!authUser) return null;

  const drawerType = width >= 768 ? 'permanent' : 'slide';

  const initialRouteName = authUser.completedFirstSetupAt
    ? 'MainStackNavigation'
    : 'FirstSetup';

  return (
    <Drawer.Navigator
      initialRouteName={initialRouteName}
      drawerType={drawerType}
      drawerContent={drawerContent}
      screenOptions={screenOptions}>
      <Drawer.Screen
        name="MainStackNavigation"
        component={MainStackNavigation}
        options={{
          title: 'Dashboard',
          drawerIcon: props => <MaterialCommunityIcons name="view-dashboard" {...props} />
        }}
      />
      <Drawer.Screen
        name="FirstSetup"
        component={FirstSetup}
        options={{
          isHidden: true
        }}
      />
    </Drawer.Navigator>
  );
}

export default React.memo(MainDrawerNavigation);
