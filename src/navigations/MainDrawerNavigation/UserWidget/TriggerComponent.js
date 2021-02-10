import React from 'react';
import { IconButton } from 'react-native-paper';
import RNVectorIcon from 'components/RNVectorIcon';
import { paperTheme } from 'theme';

function editIcon (props) {
  return (
    <RNVectorIcon
      provider="MaterialCommunityIcons"
      name="image-edit"
      {...props}
    />
  );
}

function TriggerComponent ({ onPress, disabled }) {
  return (
    <IconButton
      color={paperTheme.colors.primary}
      size={25}
      onPress={onPress}
      style={{
        backgroundColor: '#fff',
        position: 'absolute',
        bottom: -20,
        right: -15
      }}
      icon={editIcon}
      disabled={disabled}
    />
  );
}

export default React.memo(TriggerComponent);
