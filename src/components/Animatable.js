import React from 'react';
import * as RNAnimatable from 'react-native-animatable';

function Animatable (
  { type = 'View', duration = 300, children, ...animatableProps },
  animatableRef
) {
  const AnimatableComponent = RNAnimatable[type];

  return (
    <AnimatableComponent
      ref={animatableRef}
      duration={duration}
      easing="linear"
      useNativeDriver
      {...animatableProps}
    >
      {children}
    </AnimatableComponent>
  );
}

export default React.forwardRef(Animatable);
