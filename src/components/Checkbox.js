import React from 'react';
import { View } from 'react-native';
import RNCheckBox from 'react-native-bouncy-checkbox';
import { paperTheme } from 'theme';

function Checkbox ({
  content = null,
  value,
  onChange,
  disabled,
  containerStyles,
  ...checkboxProps
}) {
  const onPress = React.useCallback(() => {
    onChange(!value);
  }, [value, onChange]);

  const color = disabled
    ? paperTheme.colors.disabled
    : paperTheme.colors.primary;

  return (
    <View
      style={[
        {
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'flex-start',
          marginBottom: 30
        },
        containerStyles
      ]}
    >
      <RNCheckBox
        {...checkboxProps}
        disabled={disabled}
        isChecked={value}
        onPress={onPress}
        fillColor={color}
        iconStyle={{ borderColor: color }}
        disableBuiltInState
      />
      <View style={{ flex: 1 }}>{content}</View>
    </View>
  );
}

export default React.memo(Checkbox);
