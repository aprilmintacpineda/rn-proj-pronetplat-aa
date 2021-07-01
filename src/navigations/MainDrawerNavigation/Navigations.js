import messaging from '@react-native-firebase/messaging';
import { createDrawerNavigator } from '@react-navigation/drawer';
import React from 'react';
import useFluxibleStore from 'react-fluxible/lib/useFluxibleStore';
import { Divider, Drawer as RNPDrawer } from 'react-native-paper';
import useWindowDimensions from 'react-native/Libraries/Utilities/useWindowDimensions';
import UserWidget from './UserWidget';
import RNVectorIcon from 'components/RNVectorIcon';
import { logout } from 'fluxible/actions/user';
import { hasCompletedSetup } from 'libs/user';
import { clearWebSocket, connectWebSocket } from 'libs/webSocket';
import LoggedInStackNavigation from 'navigations/LoggedInStackNavigation';
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
      <UserWidget />
      {drawerItems}
      <Divider style={{ margin: 10, marginVertical: 20 }} />
      <RNPDrawer.Item
        onPress={() => {
          navigate('About');
        }}
        label="About Entrepic"
        icon={props => (
          <RNVectorIcon
            provider="AntDesign"
            name="infocirlceo"
            {...props}
          />
        )}
      />
      <Divider style={{ margin: 10, marginVertical: 20 }} />
      <RNPDrawer.Item
        onPress={logout}
        label="Logout"
        icon={props => (
          <RNVectorIcon
            provider="AntDesign"
            name="logout"
            {...props}
          />
        )}
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

function PlaceholderScreen () {
  return null;
}

function Navigations () {
  const { authUser } = useFluxibleStore(mapStates);
  const { width } = useWindowDimensions();

  const initialRouteName = hasCompletedSetup(authUser)
    ? 'LoggedInStackNavigation'
    : 'FirstSetup';

  React.useEffect(() => {
    messaging().requestPermission();
    connectWebSocket();
    return clearWebSocket;
  }, []);

  return (
    <Drawer.Navigator
      initialRouteName={initialRouteName}
      drawerType={width >= 768 ? 'permanent' : 'slide'}
      drawerContent={drawerContent}
      screenOptions={screenOptions}
    >
      <Drawer.Screen
        name="LoggedInStackNavigation"
        component={LoggedInStackNavigation}
        options={{
          drawerLabel: 'Dashboard',
          drawerIcon: props => (
            <RNVectorIcon
              provider="Ionicons"
              name="ios-home-outline"
              {...props}
            />
          )
        }}
      />
      <Drawer.Screen
        name="EventsPlaceholder"
        component={PlaceholderScreen}
        options={{
          drawerLabel: 'Events',
          drawerIcon: props => (
            <RNVectorIcon
              provider="MaterialCommunityIcons"
              name="calendar-outline"
              {...props}
            />
          ),
          to: 'Events'
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
              name="qrcode-plus"
              {...props}
            />
          ),
          badge: authUser.receivedContactRequestsCount,
          to: 'ContactRequests'
        }}
      />
      <Drawer.Screen
        name="NotificationsPlaceHolder"
        component={PlaceholderScreen}
        options={{
          drawerLabel: 'Notifications',
          drawerIcon: props => (
            <RNVectorIcon
              provider="Feather"
              name="bell"
              {...props}
            />
          ),
          badge: authUser.notificationsCount,
          to: 'Notifications'
        }}
      />
      <Drawer.Screen
        name="SettingsPlaceHolder"
        component={PlaceholderScreen}
        options={{
          drawerLabel: 'Settings',
          drawerIcon: props => (
            <RNVectorIcon
              provider="Ionicons"
              name="ios-settings-outline"
              {...props}
            />
          ),
          to: 'Settings'
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
