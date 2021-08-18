import React from 'react';
import { View } from 'react-native';
import { paperTheme } from 'theme';

function VerticalLineSeparator () {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 2
      }}
    >
      <View
        style={{
          borderRightWidth: 1,
          borderRightColor: paperTheme.colors.disabled,
          height: '100%',
          marginHorizontal: 10
        }}
      />
    </View>
  );
}

export default React.memo(VerticalLineSeparator);
