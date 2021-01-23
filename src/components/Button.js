import React from 'react';
import { Button as RNPButton } from 'react-native-paper';
import { navigationRef } from 'App';
import { paperTheme } from 'theme';

function Button ({
  children,
  onPress,
  to,
  params,
  style,
  mode,
  color,
  disabled,
  ...rnpButtonProps
}) {
  const handlePress = React.useCallback(
    (...args) => {
      if (to) navigationRef.current.navigate(to, params);
      else onPress(...args);
    },
    [to, params, onPress]
  );

  return (
    <RNPButton
      onPress={handlePress}
      mode={mode}
      style={[
        mode === 'outlined'
          ? {
              borderColor: disabled
                ? paperTheme.colors.disabled
                : color
            }
          : null,
        style
      ]}
      color={color}
      disabled={disabled}
      {...rnpButtonProps}
    >
      {children}
    </RNPButton>
  );
}

export default React.memo(Button);
