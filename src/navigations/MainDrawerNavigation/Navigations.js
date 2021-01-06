import messaging from '@react-native-firebase/messaging';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { updateStore } from 'fluxible-js';
import React from 'react';
import useFluxibleStore from 'react-fluxible/lib/useFluxibleStore';
import { Divider, Drawer as RNPDrawer } from 'react-native-paper';
import useWindowDimensions from 'react-native/Libraries/Utilities/useWindowDimensions';
import RNVectorIcon from 'components/RNVectorIcon';
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
    const { drawerLabel, drawerIcon, isHidden, badge, to } = options;

    if (isHidden) return null;

    return (
      <RNPDrawer.Item
        key={key}
        onPress={() => {
          navigate(to || name);
        }}
        label={drawerLabel}
        icon={drawerIcon}
        active={index === i}
        badge={badge}
      />
    );
  });

  return (
    <>
      {drawerItems}
      <Divider style={{ margin: 10, marginVertical: 20 }} />
      <RNPDrawer.Item
        onPress={logout}
        label="Logout"
        icon={props => <RNVectorIcon provider="AntDesign" name="logout" {...props} />}
      />
    </>
  );
}

const screenOptions = {
  swipeEnabled: false
};

function mapStates ({ authUser, receivedContactRequestCount, notificationsCount }) {
  return { authUser, receivedContactRequestCount, notificationsCount };
}

function PlaceholderScreen () {
  return null;
}

function Navigations () {
  const hasInternet = useHasInternet();
  const { authUser, receivedContactRequestCount, notificationsCount } = useFluxibleStore(
    mapStates
  );
  const { width } = useWindowDimensions();

  React.useEffect(() => {
    if (!hasInternet) return;

    (async () => {
      try {
        const response = await xhr('/badge-count');
        const { receivedContactRequestCount, notificationsCount } = await response.json();

        updateStore({
          receivedContactRequestCount,
          notificationsCount
        });
      } catch (error) {
        console.log(error);
      }
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
          drawerLabel: 'Dashboard',
          drawerIcon: props => (
            <RNVectorIcon
              provider="MaterialCommunityIcons"
              name="view-dashboard"
              {...props}
            />
          )
        }}
      />
      <Drawer.Screen
        name="ContactRequestsPlaceholder"
        component={PlaceholderScreen}
        options={{
          drawerLabel: 'Contact Requests',
          drawerIcon: props => (
            <RNVectorIcon
              provider="MaterialCommunityIcons"
              name="account-network"
              {...props}
            />
          ),
          badge: receivedContactRequestCount,
          to: 'ContactRequests'
        }}
      />
      <Drawer.Screen
        name="NotificationsPlaceHolder"
        component={PlaceholderScreen}
        options={{
          drawerLabel: 'Notifications',
          drawerIcon: props =>
            <RNVectorIcon provider="Ionicons" name="ios-notifications" {...props} />
          ,
          badge: notificationsCount,
          to: 'Notifications'
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
