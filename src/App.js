import 'customAnimations';

import { useNetInfo } from '@react-native-community/netinfo';
import crashlytics from '@react-native-firebase/crashlytics';
import iid from '@react-native-firebase/iid';
import messaging from '@react-native-firebase/messaging';
import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import useFluxibleStore from 'react-fluxible/lib/useFluxibleStore';
import { KeyboardAvoidingView, Platform, StatusBar, View } from 'react-native';
import RNBootSplash from 'react-native-bootsplash';
import { Provider as PaperProvider, Text } from 'react-native-paper';

import FullSafeAreaView from 'components/FullSafeAreaView';
import { initStore } from 'fluxible/store/init';
import { appMounted, logScreenView } from 'libs/logging';
import IndexStackNavigator from 'navigations/IndexStackNavigator';
import PopupManager from 'PopupManager';
import { navigationTheme, paperTheme } from 'theme';

export const navigationRef = React.createRef();

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
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
  const { isConnected, isInternetReachable } = useNetInfo();

  React.useEffect(() => {
    initStore();
    appMounted();
  }, []);

  React.useEffect(() => {
    (async () => {
      const authStatus = await messaging().requestPermission();
      const { AUTHORIZED, PROVISIONAL } = messaging.AuthorizationStatus;
      const wasAllowed = authStatus === AUTHORIZED || authStatus === PROVISIONAL;

      const token = await iid().getToken();
      await crashlytics().setUserId(token);
      console.log('token', token);

      if (!wasAllowed) return;

      const openedNotif = await messaging().getInitialNotification();
      console.log('openedNotif', openedNotif);

      messaging().onMessage(async remoteMessage => {
        console.log('remoteMessage', remoteMessage);
      });

      messaging().onTokenRefresh(async newToken => {
        console.log('newToken', newToken);
      });
    })();
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
        onStateChange={logScreenView}>
        <PaperProvider theme={paperTheme}>
          <PopupManager />
          <FullSafeAreaView>
            <KeyboardAvoidingView
              style={{ flex: 1 }}
              behavior={avoidBehavior}
              keyboardVerticalOffset={avoidOffset}>
              {!isConnected || isInternetReachable === false ? (
                <View style={{ backgroundColor: paperTheme.colors.error, padding: 3 }}>
                  <Text style={{ color: '#fff' }}>No internet connection.</Text>
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
