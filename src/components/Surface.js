import React from 'react';
import { Surface as RNPSurface } from 'react-native-paper';
import { paperTheme } from 'theme';

function Surface ({ children, style }) {
  return (
    <RNPSurface
      style={[
        {
          padding: 10,
          borderRadius: paperTheme.roundness,
          elevation: 2,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 1
          },
          shadowOpacity: 0.2,
          shadowRadius: 1.41
        },
        style
      ]}
    >
      {children}
    </RNPSurface>
  );
}

export default React.memo(Surface);
