import 'customAnimations';

import { useNetInfo } from '@react-native-community/netinfo';
import {
  NavigationContainer,
  DefaultTheme as navigationDefaultTheme
} from '@react-navigation/native';
import React from 'react';
import useFluxibleStore from 'react-fluxible/lib/useFluxibleStore';
import { KeyboardAvoidingView, Platform, StatusBar, View } from 'react-native';
import RNBootSplash from 'react-native-bootsplash';
import {
  DefaultTheme as paperDefaultTheme,
  Provider as PaperProvider,
  Text,
  useTheme
} from 'react-native-paper';

import FullSafeAreaView from 'components/FullSafeAreaView';
import { initStore } from 'fluxible/store/init';
import IndexStackNavigator from 'navigations/IndexStackNavigator';
import PopupManager from 'PopupManager';

export const navigationRef = React.createRef();

const paperTheme = {
  ...paperDefaultTheme
};

const navigationTheme = {
  ...navigationDefaultTheme,
  colors: {
    ...navigationDefaultTheme.colors,
    primary: paperTheme.colors.primary
  }
};

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
  const {
    colors: { error }
  } = useTheme();

  React.useEffect(() => {
    initStore();
  }, []);

  React.useEffect(() => {
    if (initComplete) RNBootSplash.hide();
  }, [initComplete]);

  if (!initComplete) return null;

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <NavigationContainer ref={navigationRef} theme={navigationTheme}>
        <PaperProvider theme={paperTheme}>
          <PopupManager />
          <FullSafeAreaView>
            <KeyboardAvoidingView
              style={{ flex: 1 }}
              behavior={avoidBehavior}
              keyboardVerticalOffset={avoidOffset}>
              {!isConnected || isInternetReachable === false ? (
                <View style={{ backgroundColor: error, padding: 3 }}>
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
