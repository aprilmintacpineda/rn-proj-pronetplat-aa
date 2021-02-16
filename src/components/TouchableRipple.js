import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { TouchableRipple as RNPTouchableRipple } from 'react-native-paper';

function TouchableRipple ({
  to = null,
  params = null,
  onPress = null,
  children
}) {
  const { navigate } = useNavigation();

  const handleOnPress = React.useCallback(() => {
    if (to) navigate(to, params);
    else onPress();
  }, [onPress, to, params, navigate]);

  return (
    <RNPTouchableRipple onPress={handleOnPress}>
      {children}
    </RNPTouchableRipple>
  );
}

export default React.memo(TouchableRipple);
