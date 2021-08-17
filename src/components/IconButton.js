import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { IconButton as RNPIconButton } from 'react-native-paper';
import RNVectorIcon from './RNVectorIcon';
import { paperTheme } from 'theme';

function IconButton ({
  size = 25,
  disabled,
  viewStyle,
  isLoading,
  isSuccess,
  ...iconProps
}) {
  if (isSuccess) {
    return (
      <View
        style={{
          backgroundColor: paperTheme.colors.primary,
          borderRadius: 100,
          padding: 5
        }}
      >
        <RNVectorIcon
          provider="Ionicons"
          name="checkmark"
          size={size}
          color="#fff"
        />
      </View>
    );
  }

  if (isLoading) {
    return (
      <View
        style={{
          backgroundColor: paperTheme.colors.primary,
          borderRadius: 100,
          padding: 5
        }}
      >
        <ActivityIndicator size={size} color="#fff" />
      </View>
    );
  }

  return (
    <View
      style={{
        borderRadius: 100,
        backgroundColor: disabled
          ? paperTheme.colors.disabled
          : paperTheme.colors.primary,
        ...viewStyle
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
