import React from 'react';
import * as RNAnimatable from 'react-native-animatable';

function Animatable ({ type = 'View', duration = 300, children, ...animatableProps }) {
  const AnimatableComponent = RNAnimatable[type];

  return (
    <AnimatableComponent
      duration={duration}
      easing="linear"
      useNativeDriver
      {...animatableProps}>
      {children}
    </AnimatableComponent>
  );
}

export default React.memo(Animatable);
