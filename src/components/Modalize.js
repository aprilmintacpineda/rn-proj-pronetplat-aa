import React from 'react';
import { View } from 'react-native';
import { Modalize as RNModalize } from 'react-native-modalize';
import { Portal } from 'react-native-paper';

function Modalize ({ children }, modalizeRef) {
  return (
    <Portal>
      <RNModalize
        adjustToContentHeight
        ref={modalizeRef}
        handlePosition="inside"
      >
        <View
          style={{ margin: 15, marginTop: 40, marginBottom: 30 }}
        >
          {children}
        </View>
      </RNModalize>
    </Portal>
  );
}

export default React.forwardRef(Modalize);