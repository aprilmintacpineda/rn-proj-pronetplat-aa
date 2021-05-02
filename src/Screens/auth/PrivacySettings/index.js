import React from 'react';
import { View } from 'react-native';
import SearchByName from './SearchByName';

function PrivacySettingsForm () {
  return (
    <View style={{ margin: 20 }}>
      <SearchByName />
    </View>
  );
}

export default React.memo(PrivacySettingsForm);
