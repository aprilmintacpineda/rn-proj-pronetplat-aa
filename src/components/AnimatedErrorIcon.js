import React from 'react';
import Animatable from './Animatable';
import RNVectorIcon from './RNVectorIcon';
import { paperTheme } from 'theme';

function AnimatedErrorIcon ({ size = 20 }) {
  return (
    <Animatable
      style={{ justifyContent: 'center', alignItems: 'center' }}
      animation="bounceIn"
      duration={500}
    >
      <RNVectorIcon
        provider="Ionicons"
        name="ios-close-circle-outline"
        size={size}
        color={paperTheme.colors.error}
      />
    </Animatable>
  );
}

export default React.memo(AnimatedErrorIcon);
