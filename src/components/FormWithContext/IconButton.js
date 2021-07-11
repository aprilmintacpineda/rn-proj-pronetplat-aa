import React from 'react';
import { FormContext } from '.';
import { navigationRef } from 'App';
import IconButton from 'components/IconButton';

function FormIconButton ({
  children,
  onPress,
  to,
  params,
  disabled: disabledFromProps = false,
  ...iconButtonProps
}) {
  const { disabled } = React.useContext(FormContext);

  const handlePress = React.useCallback(
    (...args) => {
      if (to) navigationRef.current.navigate(to, params);
      else onPress(...args);
    },
    [to, params, onPress]
  );

  return (
    <IconButton
      disabled={disabled || disabledFromProps}
      onPress={handlePress}
      {...iconButtonProps}
    >
      {children}
    </IconButton>
  );
}

export default React.memo(FormIconButton);
