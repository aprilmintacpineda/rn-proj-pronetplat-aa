import React from 'react';

import { useTheme } from 'react-native-paper';
import Animatable from './Animatable';
import RNVectorIcon from './RNVectorIcon';

function AnimatedErrorIcon ({ size = 20 }) {
  const {
    colors: { error }
  } = useTheme();

  return (
    <Animatable
      style={{ justifyContent: 'center', alignItems: 'center' }}
      animation="bounceIn"
      duration={500}>
      <RNVectorIcon
        provider="Ionicons"
        name="ios-checkmark-circle-outline"
        size={size}
        color={error}
      />
    </Animatable>
  );
}

export default React.memo(AnimatedErrorIcon);
