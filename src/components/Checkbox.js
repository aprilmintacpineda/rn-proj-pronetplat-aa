import RNCheckBox from '@react-native-community/checkbox';
import React from 'react';
import { Platform, View } from 'react-native';
import { paperTheme } from 'theme';

function CheckboxAndroid ({ disabled, ...props }) {
  return (
    <RNCheckBox
      {...props}
      disabled={disabled}
      tintColors={{
        true: disabled
          ? paperTheme.colors.disabled
          : paperTheme.colors.primary,
        false: disabled ? paperTheme.colors.disabled : undefined
      }}
      style={{ marginRight: 5 }}
    />
  );
}

function CheckboxIos ({ disabled, ...props }) {
  return (
    <RNCheckBox
      {...props}
      disabled={disabled}
      onCheckColor={
        disabled
          ? paperTheme.colors.disabled
          : paperTheme.colors.primary
      }
      onTintColor={
        disabled
          ? paperTheme.colors.disabled
          : paperTheme.colors.primary
      }
      style={{ marginRight: 10 }}
    />
  );
}

const CheckboxComponent = React.memo(
  Platform.select({
    android: CheckboxAndroid,
    ios: CheckboxIos
  })
);

function Checkbox ({ content = null, ...props }) {
  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 30
      }}
    >
      <CheckboxComponent {...props} />
      <View style={{ flex: 1 }}>{content}</View>
    </View>
  );
}

export default React.memo(Checkbox);
