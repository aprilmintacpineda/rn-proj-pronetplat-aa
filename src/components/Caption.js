import React from 'react';
import { Text } from 'react-native-paper';

function Caption ({ children, style }) {
  return <Text style={[{ fontSize: 11, color: '#8a8a8a' }, style]}>{children}</Text>;
}

export default React.memo(Caption);
