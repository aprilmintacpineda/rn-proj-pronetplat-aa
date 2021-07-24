import React from 'react';
import { Button as RNPButton } from 'react-native-paper';
import { navigationRef } from 'App';
import useCountDown from 'hooks/useCountDown';
import { paperTheme } from 'theme';

function Button ({
  children,
  onPress,
  to,
  params,
  style,
  mode,
  color = paperTheme.colors.primary,
  disabled,
  countDown = null,
  loading = false,
  ...rnpButtonProps
}) {
  const { isDone, timeLeftStr } = useCountDown({
    duration: countDown?.duration,
    start: countDown?.start,
    toTime: countDown?.toTime
  });

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
      dark
      color={color}
      disabled={disabled || !isDone || loading}
      loading={loading}
      {...rnpButtonProps}
    >
      {countDown ? children({ timeLeftStr }) : children}
    </RNPButton>
  );
}

export default React.memo(Button);
