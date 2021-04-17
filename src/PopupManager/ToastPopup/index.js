import React from 'react';
import useFluxibleStore from 'react-fluxible/lib/useFluxibleStore';
import { View } from 'react-native';
import { Portal } from 'react-native-portalize';
import Toast from './Toast';

function mapStates ({ toasts }) {
  return { toasts };
}

function Toasts () {
  const { toasts } = useFluxibleStore(mapStates);

  return (
    <Portal>
      <View
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 40,
          alignItems: 'center',
          marginHorizontal: 50
        }}
      >
        {toasts.map(toast => (
          <Toast {...toast} key={toast.id} />
        ))}
      </View>
    </Portal>
  );
}

export default React.memo(Toasts);
