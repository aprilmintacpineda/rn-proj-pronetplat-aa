import React from 'react';
import { View } from 'react-native';
import { Avatar as RNPAvatar } from 'react-native-paper';
import {
  Placeholder,
  PlaceholderMedia,
  ShineOverlay
} from 'rn-placeholder';
import useState from 'hooks/useState';

function Avatar ({ size = 60, uri, label }) {
  const { updateState, state } = useState({
    uri,
    status: 'initial'
  });

  const isLoadError = state.status === 'loadError';
  const isLoadSuccess = state.status === 'loadSuccess';

  const onLoad = React.useCallback(() => {
    setTimeout(() => {
      updateState({ status: 'loadSuccess' });
    }, 3000);
  }, [updateState]);

  const onError = React.useCallback(
    event => {
      console.log('Avatar Error', event.nativeEvent.error);
      updateState({ status: 'loadError' });
    },
    [updateState]
  );

  React.useEffect(() => {
    updateState({
      status: 'initial',
      uri
    });
  }, [updateState, uri]);

  if (state.uri && !isLoadError) {
    return (
      <>
        {!isLoadSuccess ? (
          <View
            style={{
              position: 'absolute',
              overflow: 'hidden',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0
            }}
          >
            <Placeholder Animation={ShineOverlay}>
              <PlaceholderMedia
                style={{ borderRadius: 100 }}
                size={size}
              />
            </Placeholder>
          </View>
        ) : null}
        <RNPAvatar.Image
          source={{ uri: state.uri }}
          size={size}
          onError={onError}
          onLoad={onLoad}
          style={{
            backgroundColor: '#d0d1d5',
            borderColor: '#bbbdbf',
            borderWidth: 1,
            opacity: isLoadSuccess ? 1 : 0
          }}
        />
      </>
    );
  }

  return (
    <RNPAvatar.Text
      label={label}
      labelStyle={{ fontSize: Math.floor(size * 0.3) }}
      size={size}
      style={{
        backgroundColor: '#d0d1d5',
        borderColor: '#bbbdbf',
        borderWidth: 1
      }}
    />
  );
}

export default React.memo(Avatar);
