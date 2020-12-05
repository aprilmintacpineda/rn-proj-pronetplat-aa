import React from 'react';
import { StatusBar } from 'react-native';
import { DefaultTheme as paperDefaultTheme } from 'react-native-paper';
import { NavigationContainer, DefaultTheme as navigationDefaultTheme } from '@react-navigation/native';

import FullSafeAreaView from 'components/FullSafeAreaView';
import MainStackNavigation from 'navigations/MainStackNavigation';

const navigationTheme = {
  ...navigationDefaultTheme,
  colors: {
    ...navigationDefaultTheme.colors,
    background: '#fff',
    primary: paperDefaultTheme.colors.primary
  }
};

function App () {
  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#fff"  />
      <FullSafeAreaView>
        <NavigationContainer theme={navigationTheme}>
          <MainStackNavigation />
        </NavigationContainer>
      </FullSafeAreaView>
    </>
  );
}

export default React.memo(App);
