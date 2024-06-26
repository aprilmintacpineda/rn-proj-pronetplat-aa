import React from 'react';
import { View } from 'react-native';
import Animatable from './Animatable';
import Caption from './Caption';
import RNVectorIcon from './RNVectorIcon';
import { paperTheme } from 'theme';

const { primary, error } = paperTheme.colors;

function StatusCaption ({ isError, message }) {
  let iconName = 'checkmark-circle-outline';
  let color = primary;

  if (isError) {
    iconName = 'alert-circle-outline';
    color = error;
  }

  return (
    <Animatable animation="fadeIn">
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <RNVectorIcon
          provider="Ionicons"
          name={iconName}
          size={15}
          color={color}
        />
        <Caption color={color} style={{ marginLeft: 3 }}>
          {message}
        </Caption>
      </View>
    </Animatable>
  );
}

export default React.memo(StatusCaption);
