import React from 'react';
import { Keyboard, useWindowDimensions, View } from 'react-native';
import { Portal } from 'react-native-portalize';
import Animatable from './Animatable';

function FullScreenModal ({ isVisible, children }) {
  const windowDimensions = useWindowDimensions();
  const prevIsVisible = React.useRef(isVisible);
  const animatableRef = React.useRef();
  const height = windowDimensions.height + 100;

  React.useEffect(() => {
    if (prevIsVisible.current !== isVisible) {
      prevIsVisible.current = isVisible;
      Keyboard.dismiss();

      if (isVisible) {
        animatableRef.current.animate({
          0: {
            transform: [{ translateY: height }]
          },
          1: {
            transform: [{ translateY: 0 }]
          }
        });
      } else {
        animatableRef.current.animate({
          0: {
            transform: [{ translateY: 0 }]
          },
          1: {
            transform: [{ translateY: height }]
          }
        });
      }
    }
  }, [isVisible, height]);

  return (
    <Portal>
      <Animatable
        ref={animatableRef}
        style={{ flex: 1, transform: [{ translateY: height }] }}
        duration={300}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: '#fff'
          }}
        >
          {children}
        </View>
      </Animatable>
    </Portal>
  );
}

export default React.memo(FullScreenModal);
