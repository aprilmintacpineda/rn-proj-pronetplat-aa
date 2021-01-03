import 'customAnimations';
import 'setDefaults';

import crashlytics from '@react-native-firebase/crashlytics';
import iid from '@react-native-firebase/iid';
import messaging from '@react-native-firebase/messaging';
import { NavigationContainer } from '@react-navigation/native';
import { store, updateStore } from 'fluxible-js';
import React from 'react';
import useFluxibleStore from 'react-fluxible/lib/useFluxibleStore';
import { KeyboardAvoidingView, Platform, StatusBar, View, AppState } from 'react-native';
import RNBootSplash from 'react-native-bootsplash';
import { Provider as PaperProvider, Text } from 'react-native-paper';

import FullSafeAreaView from 'components/FullSafeAreaView';
import { initStore } from 'fluxible/store/init';
import { getInitials } from 'helpers/contact';
import useHasInternet from 'hooks/useHasInternet';
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

  const { title, body } = remoteMessage.notification;
  const { type } = remoteMessage.data || {};
  let onPress = null;

  switch (type) {
    case 'contactRequest':
      if (store.contactRequestNum !== '99+') {
        let contactRequestNum = parseInt(store.contactRequestNum) + 1;
        if (contactRequestNum > 99) contactRequestNum = '99+';
        updateStore({ contactRequestNum });
      }

      onPress = () => {
        navigationRef.current.navigate('ContactRequests');
      };
      break;
    case 'contactRequestAccepted':
      if (store.notificationsNum !== '99+') {
        let notificationsNum = parseInt(store.notificationsNum) + 1;
        if (notificationsNum > 99) notificationsNum = '99+';
        updateStore({ notificationsNum });
      }

      onPress = () => {
        navigationRef.current.navigate('ContactProfile', remoteMessage.data);
      };
      break;
  }

  displayNotification({
    title,
    body,
    avatarUri: remoteMessage.data?.profilePicture || null,
    avatarLabel: getInitials(remoteMessage?.data || {}),
    onPress
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

    (async () => {
      const token = await iid().getToken();
      await crashlytics().setUserId(token);
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
              {!hasInternet ? (
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
