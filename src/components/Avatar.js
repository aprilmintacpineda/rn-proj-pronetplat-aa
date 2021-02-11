import React from 'react';
import { Avatar as RNPAvatar } from 'react-native-paper';
import useState from 'hooks/useState';

function Avatar ({ size = 60, uri, label }) {
  const { updateState, state } = useState({
    uri: null,
    isError: false
  });

  const onError = React.useCallback(
    event => {
      console.log('Avatar Error', event.nativeEvent.error);
      updateState({ isError: true });
    },
    [updateState]
  );

  React.useEffect(() => {
    updateState({
      isError: false,
      uri
    });
  }, [updateState, uri]);

  if (state.uri && !state.isError) {
    return (
      <RNPAvatar.Image
        source={{ uri: state.uri }}
        size={size}
        onError={onError}
      />
    );
  }

  return (
    <RNPAvatar.Text
      label={label}
      labelStyle={{ fontSize: Math.floor(size * 0.3) }}
      size={size}
    />
  );
}

export default React.memo(Avatar);
