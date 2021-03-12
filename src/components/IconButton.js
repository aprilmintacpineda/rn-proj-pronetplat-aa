import React from 'react';
import { View } from 'react-native';
import { IconButton as RNPIconButton } from 'react-native-paper';
import { paperTheme } from 'theme';

function IconButton (iconProps) {
  return (
    <View
      style={{
        borderRadius: 100,
        backgroundColor: paperTheme.colors.primary
      }}
    >
      <RNPIconButton
        color="#fff"
        size={25}
        style={{
          margin: 0,
          padding: 0
        }}
        {...iconProps}
      />
    </View>
  );
}

export default React.memo(IconButton);
