import React from 'react';
import { Keyboard, useWindowDimensions, View } from 'react-native';
import { Portal } from 'react-native-paper';
import Animatable from './Animatable';

function FullScreenModal ({ onClose, onOpen, isVisible, children }) {
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

        if (onOpen) onOpen();
      } else {
        animatableRef.current.animate({
          0: {
            transform: [{ translateY: 0 }]
          },
          1: {
            transform: [{ translateY: height }]
          }
        });

        if (onClose) onClose();
      }
    }
  }, [isVisible, height, onOpen, onClose]);

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
