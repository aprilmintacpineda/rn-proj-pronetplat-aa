import 'customAnimations';
import 'setDefaults';

import geolocation from '@react-native-community/geolocation';
import messaging from '@react-native-firebase/messaging';
import { NavigationContainer } from '@react-navigation/native';
import { store, addEvent, updateStore } from 'fluxible-js';
import React from 'react';
import useFluxibleStore from 'react-fluxible/lib/useFluxibleStore';
import { StatusBar, View } from 'react-native';
import RNBootSplash from 'react-native-bootsplash';
import { KeyboardAccessoryNavigation } from 'react-native-keyboard-accessory';
import { Provider as PaperProvider, Text } from 'react-native-paper';
import { Host } from 'react-native-portalize';
import FullSafeAreaView from 'components/FullSafeAreaView';
import KeyboardAvoidingView from 'components/KeyboardAvoidingView';
import {
  decrementContactRequestsCount,
  decrementEventInvitationsCount,
  incrementContactRequestsCount,
  incrementEventInvitationsCount,
  incrementNotificationsCount
} from 'fluxible/actions/user';
import { initStore } from 'fluxible/store/init';
import useAppStateEffect from 'hooks/useAppStateEffect';
import useHasInternet from 'hooks/useHasInternet';
import { appMounted, logScreenView } from 'libs/logging';
import {
  getFullName,
  getInitials,
  getPersonalPronoun
} from 'libs/user';
import IndexStackNavigator from 'navigations/IndexStackNavigator';
import PopupManager from 'PopupManager';
import { displayNotification } from 'PopupManager/NotificationPopup';
import { navigationTheme, paperTheme } from 'theme';

geolocation.setRNConfiguration({ authorizationLevel: 'whenInUse' });

export const navigationRef = React.createRef();

const webSocketEventHandlers = {
  notification: ({
    sender,
    trigger,
    payload: { event, title, body, user }
  }) => {
    switch (trigger) {
      case 'contactRequestCancelled':
        decrementContactRequestsCount();
        break;
      case 'contactRequest':
        incrementContactRequestsCount();
        break;
      case 'eventInvitation':
        incrementEventInvitationsCount();
        break;
      case 'eventInvitationCancelled':
        decrementEventInvitationsCount();
        break;
    }

    if (
      trigger !== 'contactRequest' &&
      trigger !== 'eventInvitation'
    )
      incrementNotificationsCount();

    const fullname = getFullName(sender);

    displayNotification({
      title: title.replace(/{fullname}/gim, fullname),
      body: body
        .replace(/{fullname}/gim, fullname)
        .replace(
          /{genderPossessiveLowercase}/gim,
          getPersonalPronoun(sender).possessive.lowercase
        )
        .replace(/{eventName}/gim, event?.name || '')
        .replace(
          /{userFullNamePossessive}/gim,
          user?.id === sender.id
            ? getPersonalPronoun(sender).possessive.lowercase
            : `${getFullName(sender)}'s`
        ),
      avatarUri: sender.profilePicture,
      avatarLabel: getInitials(sender),
      onPress: () => {
        const screensByTrigger = {
          contactRequest: {
            name: 'ContactRequests'
          },
          contactRequestAccepted: {
            name: 'ContactProfile',
            params: sender
          },
          contactRequestCancelled: {
            name: 'ContactProfile',
            params: sender
          },
          contactRequestDeclined: {
            name: 'ContactProfile',
            params: sender
          },
          addedAsOrganizerToEvent: {
            name: 'ViewEvent',
            params: event
          },
          eventInvitation: {
            name: 'EventInvitations'
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
  chatMessageReceived: ({ sender }) => {
    const currentRoute = navigationRef.current.getCurrentRoute();

    if (
      currentRoute.name === 'ContactChat' &&
      currentRoute.params.id === sender.id
    )
      return;

    updateStore({
      authUser: {
        ...store.authUser,
        unreadChatMessagesCount:
          (store.authUser.unreadChatMessagesCount || 0) + 1
      }
    });

    displayNotification({
      title: 'New message',
      body: `${getFullName(sender)} sent you a message.`,
      avatarUri: sender.profilePicture,
      avatarLabel: getInitials(sender),
      onPress: () => {
        navigationRef.current.navigate('ContactChat', sender);
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
    updateStore({ deviceToken: await messaging().getToken() });
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

  React.useEffect(
    () =>
      addEvent('websocketEvent', data => {
        if (!store.authUser || !store.initComplete) return;
        const handler = webSocketEventHandlers[data.type];
        if (handler) handler(data);
      }),
    []
  );

  return (
    <>
      <StatusBar
        barStyle="light-content"
        backgroundColor={paperTheme.colors.accent}
      />
      {initComplete && (
        <NavigationContainer
          ref={navigationRef}
          theme={navigationTheme}
          onReady={logScreenView}
          onStateChange={logScreenView}
        >
          <FullSafeAreaView>
            <Host>
              <PopupManager />
              <PaperProvider theme={paperTheme}>
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
              </PaperProvider>
              <KeyboardAccessoryNavigation
                nextHidden
                previousHidden
                androidAdjustResize
              />
            </Host>
          </FullSafeAreaView>
        </NavigationContainer>
      )}
    </>
  );
}

export default React.memo(App);
