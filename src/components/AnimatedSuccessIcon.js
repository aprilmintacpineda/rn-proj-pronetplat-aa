import React from 'react';

import Animatable from './Animatable';
import RNVectorIcon from './RNVectorIcon';
import { paperTheme } from 'theme';

function AnimatedSuccessIcon ({ size = 20 }) {
  return (
    <Animatable
      style={{ justifyContent: 'center', alignItems: 'center' }}
      animation="bounceIn"
      duration={500}>
      <RNVectorIcon
        provider="Ionicons"
        name="ios-checkmark-circle-outline"
        size={size}
        color={paperTheme.colors.success}
      />
    </Animatable>
  );
}

export default React.memo(AnimatedSuccessIcon);
