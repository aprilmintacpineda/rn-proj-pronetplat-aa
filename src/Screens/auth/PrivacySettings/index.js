import React from 'react';
import { View } from 'react-native';
import SearchByName from './SearchByName';
import SearchByUsername from './SearchByUsername';

function PrivacySettingsForm () {
  return (
    <View style={{ margin: 20 }}>
      <SearchByName />
      <SearchByUsername />
    </View>
  );
}

export default React.memo(PrivacySettingsForm);
