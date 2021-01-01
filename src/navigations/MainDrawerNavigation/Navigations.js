import messaging from '@react-native-firebase/messaging';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { updateStore } from 'fluxible-js';
import React from 'react';
import useFluxibleStore from 'react-fluxible/lib/useFluxibleStore';
import { Divider, Drawer as RNPDrawer } from 'react-native-paper';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import useWindowDimensions from 'react-native/Libraries/Utilities/useWindowDimensions';
import { logout } from 'fluxible/actions/user';
import useHasInternet from 'hooks/useHasInternet';
import { xhr } from 'libs/xhr';
import MainStackNavigation from 'navigations/MainStackNavigation';
import FirstSetup from 'Screens/auth/FirstSetup';

const Drawer = createDrawerNavigator();

function drawerContent (props) {
  const { state, descriptors, navigation } = props;
  const { routes, index } = state;
  const { navigate } = navigation;

  const drawerItems = routes.map(({ key, name }, i) => {
    const { options } = descriptors[key];
    const { title, drawerIcon, isHidden, badge, to } = options;

    if (isHidden) return null;

    return (
      <RNPDrawer.Item
        key={key}
        onPress={() => {
          navigate(to || name);
        }}
        label={title}
        icon={drawerIcon}
        active={index === i}
        badge={badge}
      />
    );
  });

  return (
    <>
      {drawerItems}
      <Divider style={{ margin: 10 }} />
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

function mapStates ({ authUser, contactRequestNum }) {
  return { authUser, contactRequestNum };
}

function PlaceholderScreen () {
  return null;
}

function Navigations () {
  const hasInternet = useHasInternet();
  const { authUser, contactRequestNum } = useFluxibleStore(mapStates);
  const { width } = useWindowDimensions();

  React.useEffect(() => {
    if (!hasInternet) return;

    (async () => {
      let contactRequestNum = await xhr('/contact-request-count');
      contactRequestNum = await contactRequestNum.text();
      updateStore({ contactRequestNum });
    })();
  }, [hasInternet]);

  React.useEffect(() => {
    (async () => {
      const openedNotif = await messaging().getInitialNotification();
      console.log('openedNotif', openedNotif);

      await messaging().requestPermission();
    })();
  }, []);

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
        name="ContactRequestsPlaceholder"
        component={PlaceholderScreen}
        options={{
          title: 'Contact Requests',
          drawerIcon: props =>
            <MaterialCommunityIcons name="account-network" {...props} />
          ,
          badge: contactRequestNum,
          to: 'ContactRequests'
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

export default React.memo(Navigations);
