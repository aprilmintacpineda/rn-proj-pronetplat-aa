import { DefaultTheme as navigationDefaultTheme } from '@react-navigation/native';
import { DefaultTheme as paperDefaultTheme } from 'react-native-paper';

export const paperTheme = {
  ...paperDefaultTheme,
  colors: {
    ...paperDefaultTheme.colors,
    primary: '#E46948',
    accent: '#28003A',
    caption: '#8a8a8a',
    success: '#00b003'
  }
};

export const navigationTheme = {
  ...navigationDefaultTheme,
  colors: {
    ...navigationDefaultTheme.colors,
    primary: paperTheme.colors.primary,
    background: paperTheme.colors.background
  }
};
