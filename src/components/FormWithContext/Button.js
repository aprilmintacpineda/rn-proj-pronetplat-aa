import React from 'react';
import { Button as RNPButton } from 'react-native-paper';
import { FormContext } from '.';
import { navigationRef } from 'App';

function Button ({ children, onPress, to, params, disabled = false, ...rnpButtonProps }) {
  const { disabled: formDisabled } = React.useContext(FormContext);

  const handlePress = React.useCallback(
    (...args) => {
      if (to) navigationRef.current.navigate(to, params);
      else onPress(...args);
    },
    [to, params, onPress]
  );

  return (
    <RNPButton
      disabled={disabled || formDisabled}
      onPress={handlePress}
      {...rnpButtonProps}>
      {children}
    </RNPButton>
  );
}

export default React.memo(Button);
