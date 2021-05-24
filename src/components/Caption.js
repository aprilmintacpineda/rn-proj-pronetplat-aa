import React from 'react';
import { Text } from 'react-native-paper';
import { paperTheme } from 'theme';

function Caption ({
  children,
  style,
  color = paperTheme.colors.caption
}) {
  return (
    <Text style={[{ fontSize: 11, color }, style]}>{children}</Text>
  );
}

export default React.memo(Caption);
