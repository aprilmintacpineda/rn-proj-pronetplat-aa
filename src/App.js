import 'customAnimations';
import 'setDefaults';

import crashlytics from '@react-native-firebase/crashlytics';
import messaging from '@react-native-firebase/messaging';
import { NavigationContainer } from '@react-navigation/native';
import { updateStore, store } from 'fluxible-js';
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
import { Host } from 'react-native-portalize';
import FullSafeAreaView from 'components/FullSafeAreaView';
import {
  decrementContactRequestsCount,
  incrementContactRequestsCount,
  incrementNotificationsCount
} from 'fluxible/actions/user';
import { initStore } from 'fluxible/store/init';
import useHasInternet from 'hooks/useHasInternet';
import { appMounted, logScreenView } from 'libs/logging';
import { getInitials } from 'libs/user';
import IndexStackNavigator from 'navigations/IndexStackNavigator';
import PopupManager from 'PopupManager';
import { displayNotification } from 'PopupManager/NotificationPopup';
import { navigationTheme, paperTheme } from 'theme';

export const navigationRef = React.createRef();

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
    appMounted();
    initStore();
  }, []);

  React.useEffect(() => {
    if (initComplete) {
      messaging().onTokenRefresh(async deviceToken => {
        updateStore({ deviceToken });
        await crashlytics().setUserId(deviceToken);
      });

      RNBootSplash.hide();
    }
  }, [initComplete]);

  React.useEffect(() => {
    const unsubscribe = messaging().onMessage(
      async remoteMessage => {
        if (!store.authUser || !store.initComplete || store.reAuth)
          return;

        const {
          data: { stringified },
          notification
        } = remoteMessage;

        const data = JSON.parse(stringified);
        const { title, body } = notification;
        const { type, category, profilePicture } = data;

        if (type === 'contactRequestCancelled')
          decrementContactRequestsCount();
        else if (type === 'contactRequest')
          incrementContactRequestsCount();

        if (category === 'notification')
          incrementNotificationsCount();

        if (AppState.currentState !== 'active') return;

        displayNotification({
          title,
          body,
          avatarUri: profilePicture,
          avatarLabel: getInitials(data),
          onPress: () => {
            const screensByType = {
              contactRequest: 'ContactRequests',
              contactRequestAccepted: 'ContactProfile',
              contactRequestCancelled: 'ContactProfile',
              contactRequestDeclined: 'ContactProfile'
            };

            const targetScreen = screensByType[type];
            if (targetScreen)
              navigationRef.current.navigate(targetScreen, data);
          }
        });
      }
    );

    return unsubscribe;
  }, []);

  if (!initComplete) return null;

  return (
    <>
      <StatusBar
        barStyle="light-content"
        backgroundColor={paperTheme.colors.accent}
      />
      <NavigationContainer
        ref={navigationRef}
        theme={navigationTheme}
        onReady={logScreenView}
        onStateChange={logScreenView}
      >
        <Host>
          <PopupManager />
          <PaperProvider theme={paperTheme}>
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
        </Host>
      </NavigationContainer>
    </>
  );
}

export default React.memo(App);
