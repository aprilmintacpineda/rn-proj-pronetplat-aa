import React from 'react';
import CheckBoxComponent from 'react-native-bouncy-checkbox';
import { paperTheme } from 'theme';

function Checkbox (props) {
  return (
    <CheckBoxComponent
      {...props}
      fillColor={paperTheme.colors.primary}
      iconStyle={{ borderColor: paperTheme.colors.primary }}
    />
  );
}

export default React.memo(Checkbox);
