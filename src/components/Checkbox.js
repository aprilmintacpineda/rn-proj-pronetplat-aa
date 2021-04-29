import React from 'react';
import { View } from 'react-native';
import RNCheckBox from 'react-native-bouncy-checkbox';
import { paperTheme } from 'theme';

function Checkbox ({
  content = null,
  value,
  onChange,
  ...checkboxProps
}) {
  const onPress = React.useCallback(() => {
    onChange(!value);
  }, [value, onChange]);

  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 30
      }}
    >
      <RNCheckBox
        {...checkboxProps}
        isChecked={value}
        onPress={onPress}
        fillColor={paperTheme.colors.primary}
        iconStyle={{
          borderColor: paperTheme.colors.primary
        }}
        disableBuiltInState
      />
      <View style={{ flex: 1 }}>{content}</View>
    </View>
  );
}

export default React.memo(Checkbox);
