import React from 'react';
import { Button as RNPButton } from 'react-native-paper';
import { navigationRef } from 'App';

function Button ({ children, onPress, to, params, ...rnpButtonProps }) {
  const handlePress = React.useCallback(
    (...args) => {
      if (to) navigationRef.current.navigate(to, params);
      else onPress(...args);
    },
    [to, params, onPress]
  );

  return (
    <RNPButton onPress={handlePress} {...rnpButtonProps}>
      {children}
    </RNPButton>
  );
}

export default React.memo(Button);
