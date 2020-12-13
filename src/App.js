import 'customAnimations';

import {
  NavigationContainer,
  DefaultTheme as navigationDefaultTheme
} from '@react-navigation/native';
import React from 'react';
import useFluxibleStore from 'react-fluxible/lib/useFluxibleStore';
import { KeyboardAvoidingView, Platform, StatusBar } from 'react-native';
import {
  DefaultTheme as paperDefaultTheme,
  Provider as PaperProvider
} from 'react-native-paper';

import FullSafeAreaView from 'components/FullSafeAreaView';
import { initStore } from 'fluxible/store/init';
import PopupManager from 'PopupManager';
import Screens from 'Screens';

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

  React.useEffect(() => {
    initStore();
  }, []);

  if (!initComplete) return null;

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={avoidBehavior}
        keyboardVerticalOffset={avoidOffset}>
        <NavigationContainer ref={navigationRef} theme={navigationTheme}>
          <PaperProvider theme={paperTheme}>
            <FullSafeAreaView>
              <PopupManager />
              <Screens />
            </FullSafeAreaView>
          </PaperProvider>
        </NavigationContainer>
      </KeyboardAvoidingView>
    </>
  );
}

export default React.memo(App);
