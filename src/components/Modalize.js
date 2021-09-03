import React from 'react';
import { Keyboard, Animated, SafeAreaView } from 'react-native';
import { Modalize as RNModalize } from 'react-native-modalize';
import { Portal } from 'react-native-paper';

function Modalize (
  { children, customRenderer, ...modalizeProps },
  modalizeRef
) {
  const onOpen = React.useCallback(() => {
    Keyboard.dismiss();
  }, []);

  const onClose = React.useCallback(() => {
    Keyboard.dismiss();
  }, []);

  const contents = (
    <SafeAreaView
      style={{ margin: 15, marginTop: 40, marginBottom: 30 }}
    >
      {children}
    </SafeAreaView>
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
        keyboardAvoidingOffset={45}
      >
        {contents}
      </RNModalize>
    </Portal>
  );
}

export default React.forwardRef(Modalize);
