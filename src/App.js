import {
  NavigationContainer,
  DefaultTheme as navigationDefaultTheme
} from '@react-navigation/native';
import React from 'react';
import { KeyboardAvoidingView, Platform, StatusBar } from 'react-native';
import {
  DefaultTheme as paperDefaultTheme,
  Provider as PaperProvider
} from 'react-native-paper';

import FullSafeAreaView from 'components/FullSafeAreaView';
import Screens from 'Screens';

export const navigationRef = React.createRef();

const navigationTheme = {
  ...navigationDefaultTheme,
  colors: {
    ...navigationDefaultTheme.colors,
    primary: paperDefaultTheme.colors.primary
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

function App () {
  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={avoidBehavior}
        keyboardVerticalOffset={avoidOffset}>
        <NavigationContainer ref={navigationRef} theme={navigationTheme}>
          <PaperProvider>
            <FullSafeAreaView>
              <Screens />
            </FullSafeAreaView>
          </PaperProvider>
        </NavigationContainer>
      </KeyboardAvoidingView>
    </>
  );
}

export default React.memo(App);
