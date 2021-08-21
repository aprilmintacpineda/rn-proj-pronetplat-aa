import React from 'react';
import { TouchableOpacity, Linking } from 'react-native';
import { Text } from 'react-native-paper';
import { navigationRef } from 'App';
import { paperTheme } from 'theme';

function TextLink ({
  to,
  params = null,
  children,
  textStyle = null,
  onPress = null,
  isExternal = false,
  ...props
}) {
  const handlePress = React.useCallback(() => {
    if (to) {
      if (isExternal) Linking.openURL(to);
      else navigationRef.current.navigate(to, params);
    }

    if (onPress) onPress();
  }, [to, params, onPress, isExternal]);

  return (
    <TouchableOpacity onPress={handlePress} {...props}>
      <Text
        style={[{ color: paperTheme.colors.primary }, textStyle]}
      >
        {children}
      </Text>
    </TouchableOpacity>
  );
}

export default React.memo(TextLink);
