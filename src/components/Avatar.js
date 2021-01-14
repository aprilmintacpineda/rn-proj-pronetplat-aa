import React from 'react';
import { Avatar as RNPAvatar } from 'react-native-paper';

function Avatar ({ size = 60, uri, label }) {
  const [isError, setIsError] = React.useState(false);

  const onError = React.useCallback(() => {
    setIsError(true);
  }, []);

  if (uri && !isError) {
    return (
      <RNPAvatar.Image
        source={{ uri }}
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
