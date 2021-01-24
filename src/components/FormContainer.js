import React from 'react';
import { View } from 'react-native';
import { Surface } from 'react-native-paper';
import { paperTheme } from 'theme';

function FormContainer ({ children }) {
  return (
    <View style={{ padding: 20 }}>
      <Surface
        style={{
          padding: 20,
          borderRadius: paperTheme.roundness,
          elevation: 1
        }}
      >
        {children}
      </Surface>
    </View>
  );
}

export default React.memo(FormContainer);
