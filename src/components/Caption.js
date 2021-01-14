import React from 'react';
import { Text } from 'react-native-paper';

function Caption ({ children, style, color = '#8a8a8a' }) {
  return (
    <Text style={[{ fontSize: 11, color }, style]}>{children}</Text>
  );
}

export default React.memo(Caption);
