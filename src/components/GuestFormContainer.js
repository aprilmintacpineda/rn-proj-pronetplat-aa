import React from 'react';
import { View } from 'react-native';
import { Divider, Headline, Subheading, Surface } from 'react-native-paper';

function GuestFormContainer ({ children }) {
  return (
    <View style={{ padding: 20 }}>
      <Surface style={{ padding: 20, borderRadius: 4, elevation: 1 }}>
        <Headline>Connect Express</Headline>
        <Subheading>Tired of calling cards? We got you.</Subheading>
        <Divider style={{ marginVertical: 20 }} />
        {children}
      </Surface>
    </View>
  );
}

export default React.memo(GuestFormContainer);
