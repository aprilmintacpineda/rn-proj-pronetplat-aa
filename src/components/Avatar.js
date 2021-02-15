import React from 'react';
import { Image, Text, View } from 'react-native';
import { Placeholder, PlaceholderMedia, Fade } from 'rn-placeholder';
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
      <View
        style={{
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {!isLoadSuccess ? (
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0
            }}
          >
            <Placeholder Animation={Fade}>
              <PlaceholderMedia
                style={{ borderRadius: 100 }}
                size={size}
              />
            </Placeholder>
          </View>
        ) : null}
        <Image
          source={{ uri: state.uri }}
          onError={onError}
          onLoad={onLoad}
          style={{
            width: size,
            height: size,
            borderRadius: 100,
            backgroundColor: '#d0d1d5',
            borderColor: '#bbbdbf',
            borderWidth: 1,
            opacity: isLoadSuccess ? 1 : 0
          }}
        />
      </View>
    );
  }

  return (
    <View
      style={{
        backgroundColor: '#d0d1d5',
        borderColor: '#bbbdbf',
        borderWidth: 1,
        borderRadius: 100,
        width: size,
        height: size,
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Text style={{ fontSize: Math.floor(size * 0.4) }}>
        {label}
      </Text>
    </View>
  );
}

export default React.memo(Avatar);
