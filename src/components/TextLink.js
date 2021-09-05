import React from 'react';
import { Linking } from 'react-native';
import { Text } from 'react-native-paper';
import { navigationRef } from 'App';
import { paperTheme } from 'theme';

function TextLink ({
  to,
  params = null,
  children,
  style = null,
  onPress = null,
  isExternal = false,
  ...textProps
}) {
  const handlePress = React.useCallback(() => {
    if (to) {
      if (isExternal) Linking.openURL(to);
      else navigationRef.current.navigate(to, params);
    }

    if (onPress) onPress();
  }, [to, params, onPress, isExternal]);

  return (
    <Text
      style={[{ color: paperTheme.colors.primary }, style]}
      onPress={handlePress}
      {...textProps}
    >
      {children}
    </Text>
  );
}

export default React.memo(TextLink);
