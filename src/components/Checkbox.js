import RNCheckBox from '@react-native-community/checkbox';
import React from 'react';
import { Platform } from 'react-native';
import { paperTheme } from 'theme';

function CheckboxAndroid (props) {
  return (
    <RNCheckBox
      {...props}
      tintColors={{
        true: paperTheme.colors.primary
      }}
      style={{ marginRight: 5 }}
    />
  );
}

function CheckboxIos (props) {
  return (
    <RNCheckBox
      {...props}
      onCheckColor={paperTheme.colors.primary}
      onTintColor={paperTheme.colors.primary}
      style={{ marginRight: 10 }}
    />
  );
}

export default React.memo(
  Platform.select({
    android: CheckboxAndroid,
    ios: CheckboxIos
  })
);
