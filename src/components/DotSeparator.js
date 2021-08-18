import React from 'react';
import { Text, View } from 'react-native';
import { paperTheme } from 'theme';

function DotSeparator () {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Text
        style={{
          fontSize: 3,
          marginHorizontal: 5,
          color: paperTheme.colors.disabled
        }}
      >
        {'\u2B24'}
      </Text>
    </View>
  );
}

export default React.memo(DotSeparator);
