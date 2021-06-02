import 'customAnimations';
import 'setDefaults';

import iid from '@react-native-firebase/iid';
import messaging from '@react-native-firebase/messaging';
import { NavigationContainer } from '@react-navigation/native';
import { store, addEvent, updateStore } from 'fluxible-js';
import React from 'react';
import useFluxibleStore from 'react-fluxible/lib/useFluxibleStore';
import { StatusBar, View } from 'react-native';
import RNBootSplash from 'react-native-bootsplash';
import { Provider as PaperProvider, Text } from 'react-native-paper';
import { Host } from 'react-native-portalize';
import FullSafeAreaView from 'components/FullSafeAreaView';
import KeyboardAvoidingView from 'components/KeyboardAvoidingView';
import {
  decrementContactRequestsCount,
  incrementContactRequestsCount,
  incrementNotificationsCount
} from 'fluxible/actions/user';
import { initStore } from 'fluxible/store/init';
import useAppStateEffect from 'hooks/useAppStateEffect';
import useHasInternet from 'hooks/useHasInternet';
import { appMounted, logScreenView } from 'libs/logging';
import { getFullName, getInitials } from 'libs/user';
import IndexStackNavigator from 'navigations/IndexStackNavigator';
import PopupManager from 'PopupManager';
import { displayNotification } from 'PopupManager/NotificationPopup';
import { navigationTheme, paperTheme } from 'theme';

export const navigationRef = React.createRef();

const webSocketEventHandlers = {
  notification: ({ user, trigger, payload: { title, body } }) => {
    if (trigger === 'contactRequestCancelled')
      decrementContactRequestsCount();
    else if (trigger === 'contactRequest')
      incrementContactRequestsCount();

    incrementNotificationsCount();

    displayNotification({
      title,
      body,
      avatarUri: user.profilePicture,
      avatarLabel: getInitials(user),
      onPress: () => {
        const screensByTrigger = {
          contactRequest: {
            name: 'ContactRequests'
          },
          contactRequestAccepted: {
            name: 'ContactProfile',
            params: user
          },
          contactRequestCancelled: {
            name: 'ContactProfile',
            params: user
          },
          contactRequestDeclined: {
            name: 'ContactProfile',
            params: user
          }
        };

        const targetScreen = screensByTrigger[trigger];
        if (targetScreen) {
          const { name, params } = targetScreen;
          navigationRef.current.navigate(name, params);
        }
      }
    });
  },
  chatMessageReceived: ({ user }) => {
    const currentRoute = navigationRef.current.getCurrentRoute();

    if (
      currentRoute.name === 'ContactChat' &&
      currentRoute.params.id === user.id
    )
      return;

    displayNotification({
      title: 'New message',
      body: `${getFullName(user)} sent you a message.`,
      avatarUri: user.profilePicture,
      avatarLabel: getInitials(user),
      onPress: () => {
        navigationRef.current.navigate('ContactChat', user);
      }
    });
  }
};

function mapStates ({ initComplete }) {
  return { initComplete };
}

function App () {
  const { initComplete } = useFluxibleStore(mapStates);
  const hasInternet = useHasInternet();

  const updateDeviceToken = React.useCallback(async () => {
    updateStore({ deviceToken: await iid().getToken() });
  }, []);

  useAppStateEffect({
    onActive: updateDeviceToken
  });

  React.useEffect(() => {
    messaging().onTokenRefresh(deviceToken => {
      updateStore({ deviceToken });
    });

    appMounted();
    initStore();
  }, []);

  React.useEffect(() => {
    if (initComplete) RNBootSplash.hide();
  }, [initComplete]);

  React.useEffect(() => {
    const unsubscribeCallback = addEvent('websocketEvent', data => {
      if (!store.authUser || !store.initComplete || store.reAuth)
        return;

      console.log('websocketEvent', JSON.stringify(data, null, 2));

      const handler = webSocketEventHandlers[data.type];
      if (handler) handler(data);
    });

    return unsubscribeCallback;
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
              <KeyboardAvoidingView>
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
