import React from 'react';
import { View } from 'react-native';
import { IconButton as RNPIconButton } from 'react-native-paper';
import { paperTheme } from 'theme';

function IconButton ({ size, disabled, ...iconProps }) {
  return (
    <View
      style={{
        borderRadius: 100,
        backgroundColor: disabled
          ? paperTheme.colors.disabled
          : paperTheme.colors.primary
      }}
    >
      <RNPIconButton
        color="#fff"
        size={size}
        style={{
          margin: 0,
          padding: 0
        }}
        disabled={disabled}
        {...iconProps}
      />
    </View>
  );
}

export default React.memo(IconButton);
