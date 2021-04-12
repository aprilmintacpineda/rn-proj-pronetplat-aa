import React from 'react';
import { TouchableWithoutFeedback, Linking } from 'react-native';
import { Text } from 'react-native-paper';
import { navigationRef } from 'App';
import { paperTheme } from 'theme';

function TextLink ({
  to,
  params = null,
  children,
  textStyle = null,
  onPress = null,
  ...props
}) {
  const handlePress = React.useCallback(() => {
    if (/^https?:\/\//gim.test(to) || /mailto:/.test(to))
      Linking.openURL(to);
    else navigationRef.current.navigate(to, params);
    if (onPress) onPress();
  }, [to, params, onPress]);

  return (
    <TouchableWithoutFeedback onPress={handlePress} {...props}>
      <Text
        style={[{ color: paperTheme.colors.primary }, textStyle]}
      >
        {children}
      </Text>
    </TouchableWithoutFeedback>
  );
}

export default React.memo(TextLink);
