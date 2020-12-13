import React from 'react';

import * as Animatable from 'react-native-animatable';
import { useTheme } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';

function AnimatedSuccessIcon ({ size = 20 }) {
  const {
    colors: { primary }
  } = useTheme();

  return (
    <Animatable.View
      style={{ justifyContent: 'center', alignItems: 'center' }}
      animation="bounceIn"
      duration={500}
      useNativeDriver
      easing="linear">
      <Ionicons name="ios-checkmark-circle-outline" size={size} color={primary} />
    </Animatable.View>
  );
}

export default React.memo(AnimatedSuccessIcon);
