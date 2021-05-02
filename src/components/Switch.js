import React from 'react';
import { View } from 'react-native';
import { Switch as RNPSwitch } from 'react-native-paper';
import { paperTheme } from 'theme';

function Switch ({ value, onChange, content, disabled }) {
  const onValueChange = React.useCallback(() => {
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
      <RNPSwitch
        value={value}
        onValueChange={onValueChange}
        color={
          disabled
            ? paperTheme.colors.disabled
            : paperTheme.colors.primary
        }
        disabled={disabled}
      />
      <View style={{ flex: 1, marginLeft: 15 }}>{content}</View>
    </View>
  );
}

export default React.memo(Switch);
