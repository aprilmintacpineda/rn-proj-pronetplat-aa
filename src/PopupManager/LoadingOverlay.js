import React from 'react';
import useFluxibleStore from 'react-fluxible/lib/useFluxibleStore';
import { View } from 'react-native';
import { Portal, ActivityIndicator } from 'react-native-paper';
import Animatable from 'components/Animatable';
import { paperTheme } from 'theme';

function mapStates ({ isOpenLoadingOverlay }) {
  return { isOpenLoadingOverlay };
}

function LoadingOverlay () {
  const { isOpenLoadingOverlay } = useFluxibleStore(mapStates);

  if (!isOpenLoadingOverlay) return null;

  return (
    <Portal>
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.8)',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Animatable
          animation="zoomIn"
          duration="150"
          style={{
            backgroundColor: '#fff',
            padding: 20,
            borderRadius: paperTheme.roundness
          }}
        >
          <ActivityIndicator size={60} />
        </Animatable>
      </View>
    </Portal>
  );
}

export default React.memo(LoadingOverlay);
