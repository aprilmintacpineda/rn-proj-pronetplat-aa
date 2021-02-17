import { DefaultTheme as navigationDefaultTheme } from '@react-navigation/native';
import color from 'color';
import { DefaultTheme as paperDefaultTheme } from 'react-native-paper';

export const paperTheme = {
  ...paperDefaultTheme,
  colors: {
    ...paperDefaultTheme.colors,
    success: '#28a745',
    rippleColor: color(paperDefaultTheme.colors.primary)
      .alpha(0.12)
      .toString()
  }
};

export const navigationTheme = {
  ...navigationDefaultTheme,
  colors: {
    ...navigationDefaultTheme.colors,
    primary: paperTheme.colors.primary
  }
};
