import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { TouchableRipple } from 'react-native-paper';
import { paperTheme } from 'theme';

function TouchableButtonLink ({ to, params = null, children }) {
  const { navigate } = useNavigation();

  const onPress = React.useCallback(() => {
    navigate(to, params);
  }, [to, params, navigate]);

  return (
    <TouchableRipple
      onPress={onPress}
      rippleColor={paperTheme.colors.rippleColor}
    >
      {children}
    </TouchableRipple>
  );
}

export default React.memo(TouchableButtonLink);
