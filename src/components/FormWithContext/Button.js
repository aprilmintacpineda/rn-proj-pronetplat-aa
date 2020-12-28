import React from 'react';
import { FormContext } from '.';
import { navigationRef } from 'App';
import Button from 'components/Button';

function FormButton ({
  children,
  onPress,
  to,
  params,
  disabled: disabledFromProps = false,
  ...rnpButtonProps
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
    <Button
      disabled={disabled || disabledFromProps}
      onPress={handlePress}
      {...rnpButtonProps}>
      {children}
    </Button>
  );
}

export default React.memo(FormButton);
