import { DefaultTheme as navigationDefaultTheme } from '@react-navigation/native';
import { DefaultTheme as paperDefaultTheme } from 'react-native-paper';

export const paperTheme = {
  ...paperDefaultTheme,
  colors: {
    ...paperDefaultTheme.colors,
    success: '#28a745',
    primaryAccent: `${paperDefaultTheme.colors.primary}30`
  }
};

export const navigationTheme = {
  ...navigationDefaultTheme,
  colors: {
    ...navigationDefaultTheme.colors,
    primary: paperTheme.colors.primary
  }
};
