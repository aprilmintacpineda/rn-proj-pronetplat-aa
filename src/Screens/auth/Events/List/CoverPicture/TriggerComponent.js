import React from 'react';
import { View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import IconButton from 'components/IconButton';
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

function TriggerComponent ({ onPress, status, resetStatus }) {
  React.useEffect(() => {
    if (status === 'uploadSuccess') setTimeout(resetStatus, 2000);
  }, [status, resetStatus]);

  return (
    <View
      style={{
        position: 'absolute',
        top: 10,
        right: 10,
        alignItems: 'flex-end'
      }}
    >
      {status === 'uploading' ? (
        <View
          style={{
            backgroundColor: paperTheme.colors.primary,
            borderRadius: 100,
            padding: 5
          }}
        >
          <ActivityIndicator size={20} color="#fff" />
        </View>
      ) : status === 'uploadSuccess' ? (
        <View
          style={{
            backgroundColor: paperTheme.colors.primary,
            borderRadius: 100,
            padding: 5
          }}
        >
          <RNVectorIcon
            provider="Ionicons"
            name="checkmark"
            size={20}
            color="#fff"
          />
        </View>
      ) : (
        <IconButton onPress={onPress} icon={editIcon} size={20} />
      )}
    </View>
  );
}

export default React.memo(TriggerComponent);
