import React from 'react';
import { View } from 'react-native';
import { Surface } from 'react-native-paper';

function CenteredSurface ({
  children,
  containerStyle = null,
  wrapperStyle = null
}) {
  return (
    <View
      style={[
        { flex: 1, justifyContent: 'center', alignItems: 'center' },
        wrapperStyle
      ]}
    >
      <Surface
        style={[
          { padding: 20, margin: 20, borderRadius: 4, elevation: 2 },
          containerStyle
        ]}
      >
        {children}
      </Surface>
    </View>
  );
}

export default React.memo(CenteredSurface);
