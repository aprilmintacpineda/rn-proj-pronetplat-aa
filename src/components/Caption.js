import React from 'react';
import { Text } from 'react-native-paper';

function Caption ({ children }) {
  return <Text style={{ fontSize: 11, color: '#8a8a8a' }}>{children}</Text>;
}

export default React.memo(Caption);
