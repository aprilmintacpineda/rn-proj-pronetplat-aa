import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { TouchableRipple } from 'react-native-paper';

function TouchableButtonLink ({ to, params = null, children }) {
  const { navigate } = useNavigation();

  const onPress = React.useCallback(() => {
    navigate(to, params);
  }, [to, params, navigate]);

  return (
    <TouchableRipple onPress={onPress}>{children}</TouchableRipple>
  );
}

export default React.memo(TouchableButtonLink);
