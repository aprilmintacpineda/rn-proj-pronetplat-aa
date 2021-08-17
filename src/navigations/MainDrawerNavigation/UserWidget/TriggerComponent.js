import React from 'react';
import { View } from 'react-native';
import IconButton from 'components/IconButton';
import RNVectorIcon from 'components/RNVectorIcon';

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
        bottom: 0,
        right: 0,
        left: 0,
        alignItems: 'flex-end'
      }}
    >
      <IconButton
        onPress={onPress}
        icon={editIcon}
        size={20}
        isLoading={status === 'uploading'}
        isSuccess={status === 'uploadSuccess'}
      />
    </View>
  );
}

export default React.memo(TriggerComponent);
