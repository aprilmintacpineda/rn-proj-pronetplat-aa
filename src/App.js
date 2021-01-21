import 'customAnimations';
import 'setDefaults';

import crashlytics from '@react-native-firebase/crashlytics';
import messaging from '@react-native-firebase/messaging';
import { NavigationContainer } from '@react-navigation/native';
import { store, updateStore } from 'fluxible-js';
import React from 'react';
import useFluxibleStore from 'react-fluxible/lib/useFluxibleStore';
import {
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  View,
  AppState
} from 'react-native';
import RNBootSplash from 'react-native-bootsplash';
import { Provider as PaperProvider, Text } from 'react-native-paper';
import FullSafeAreaView from 'components/FullSafeAreaView';
import { initStore } from 'fluxible/store/init';
import useHasInternet from 'hooks/useHasInternet';
import { getInitials } from 'libs/contact';
import { appMounted, logScreenView } from 'libs/logging';
import IndexStackNavigator from 'navigations/IndexStackNavigator';
import PopupManager from 'PopupManager';
import { displayNotification } from 'PopupManager/NotificationPopup';
import { navigationTheme, paperTheme } from 'theme';

export const navigationRef = React.createRef();

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
});

messaging().onMessage(async remoteMessage => {
  console.log('onMessage', remoteMessage);

  if (!store.authUser || AppState.currentState !== 'active') return;

  const { data, notification } = remoteMessage;
  const { title, body } = notification;
  const { type, category, profilePicture } = data;

  const screensByType = {
    contactRequest: 'ContactRequests',
    contactRequestAccepted: 'ContactProfile'
  };

  switch (category) {
    case 'contactRequest':
      updateStore({
        receivedContactRequestCount:
          store.receivedContactRequestCount + 1
      });
      break;
    case 'notification':
      updateStore({
        notificationsCount: store.notificationsCount + 1
      });
      break;
  }

  displayNotification({
    title,
    body,
    avatarUri: profilePicture,
    avatarLabel: getInitials(data),
    onPress: () => {
      const targetScreen = screensByType[type];
      if (targetScreen)
        navigationRef.current.navigate(targetScreen, data);
    }
  });
});

messaging().onTokenRefresh(async newToken => {
  await crashlytics().setUserId(newToken);
  console.log('onTokenRefresh', newToken);
});

messaging().onNotificationOpenedApp(async remoteMessage => {
  console.log('onNotificationOpenedApp', remoteMessage);
});

const avoidBehavior = Platform.select({
  android: 'height',
  ios: 'padding'
});

const avoidOffset = Platform.select({
  android: 40,
  ios: 0
});

function mapStates ({ initComplete }) {
  return { initComplete };
}

function App () {
  const { initComplete } = useFluxibleStore(mapStates);
  const hasInternet = useHasInternet();

  React.useEffect(() => {
    initStore();
    appMounted();
  }, []);

  React.useEffect(() => {
    if (initComplete) RNBootSplash.hide();
  }, [initComplete]);

  if (!initComplete) return null;

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <NavigationContainer
        ref={navigationRef}
        theme={navigationTheme}
        onReady={logScreenView}
        onStateChange={logScreenView}
      >
        <PaperProvider theme={paperTheme}>
          <PopupManager />
          <FullSafeAreaView>
            <KeyboardAvoidingView
              style={{ flex: 1 }}
              behavior={avoidBehavior}
              keyboardVerticalOffset={avoidOffset}
            >
              {!hasInternet ? (
                <View
                  style={{
                    backgroundColor: paperTheme.colors.error,
                    padding: 3
                  }}
                >
                  <Text style={{ color: '#fff' }}>
                    No internet connection.
                  </Text>
                </View>
              ) : null}
              <IndexStackNavigator />
            </KeyboardAvoidingView>
          </FullSafeAreaView>
        </PaperProvider>
      </NavigationContainer>
    </>
  );
}

export default React.memo(App);
