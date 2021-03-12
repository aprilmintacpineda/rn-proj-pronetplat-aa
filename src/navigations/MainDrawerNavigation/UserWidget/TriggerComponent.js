import React from 'react';
import { View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import Animatable from 'components/Animatable';
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
  const [animation, setAnimation] = React.useState('bounceIn');

  const onAnimationEnd = React.useCallback(() => {
    if (animation === 'bounceOut') resetStatus();
  }, [animation, resetStatus]);

  React.useEffect(() => {
    if (status === 'uploadSuccess') {
      setTimeout(() => {
        setAnimation('bounceOut');
      }, 2000);
    }
  }, [status]);

  if (status === 'uploading') {
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
        <View
          style={{
            backgroundColor: paperTheme.colors.primary,
            borderRadius: 100,
            padding: 5
          }}
        >
          <ActivityIndicator size={15} color="#fff" />
        </View>
      </View>
    );
  }

  if (status === 'uploadSuccess') {
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
        <Animatable
          animation={animation}
          duration={500}
          onAnimationEnd={onAnimationEnd}
          style={{
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
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
              size={15}
              color="#fff"
            />
          </View>
        </Animatable>
      </View>
    );
  }

  return (
    <View
      style={{
        position: 'absolute',
        bottom: -10,
        right: -10,
        left: 0,
        alignItems: 'flex-end'
      }}
    >
      <IconButton onPress={onPress} icon={editIcon} />
    </View>
  );
}

export default React.memo(TriggerComponent);
