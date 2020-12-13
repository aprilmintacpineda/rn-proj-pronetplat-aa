import React from 'react';

import { useTheme } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Animatable from './Animatable';

function AnimatedSuccessIcon ({ size = 20 }) {
  const {
    colors: { primary }
  } = useTheme();

  return (
    <Animatable
      style={{ justifyContent: 'center', alignItems: 'center' }}
      animation="bounceIn"
      duration={500}>
      <Ionicons name="ios-checkmark-circle-outline" size={size} color={primary} />
    </Animatable>
  );
}

export default React.memo(AnimatedSuccessIcon);
