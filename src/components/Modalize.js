import React from 'react';
import { Keyboard, View, Animated } from 'react-native';
import { Modalize as RNModalize } from 'react-native-modalize';
import { Portal } from 'react-native-paper';

function Modalize (
  { children, unmountOnClose, customRenderer, ...modalizeProps },
  modalizeRef
) {
  const [isOpen, setIsOpen] = React.useState(false);

  const onOpen = React.useCallback(() => {
    Keyboard.dismiss();
    setIsOpen(true);
  }, []);

  const onClose = React.useCallback(() => {
    Keyboard.dismiss();
    setIsOpen(false);
  }, []);

  const contents =
    unmountOnClose && !isOpen ? null : (
      <View style={{ margin: 15, marginTop: 40, marginBottom: 30 }}>
        {children}
      </View>
    );

  return (
    <Portal>
      <RNModalize
        adjustToContentHeight
        {...modalizeProps}
        ref={modalizeRef}
        handlePosition="inside"
        onOpen={onOpen}
        onClose={onClose}
        customRenderer={
          customRenderer === true ? (
            <Animated.View>{contents}</Animated.View>
          ) : (
            customRenderer
          )
        }
      >
        {contents}
      </RNModalize>
    </Portal>
  );
}

export default React.forwardRef(Modalize);
