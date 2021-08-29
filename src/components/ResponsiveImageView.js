import React from 'react';
import { Image, View } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';
import { useResponsiveImageView } from 'react-native-responsive-image-view';
import IconButton from './IconButton';
import RNVectorIcon from './RNVectorIcon';
import { paperTheme } from 'theme';

function retryIcon (props) {
  return (
    <RNVectorIcon {...props} provider="Ionicons" name="refresh" />
  );
}

function ResponsiveImage ({ uri, viewStyle, imageStyle }) {
  const [{ hasLoaded, error }, setState] = React.useState({
    hasLoaded: false,
    error: null
  });

  const onLoad = React.useCallback(() => {
    setState({
      hasLoaded: true,
      error: null
    });
  }, []);

  const onError = React.useCallback(() => {
    setState({
      hasLoaded: false,
      error: true
    });
  }, []);

  const { getViewProps, getImageProps, retry } =
    useResponsiveImageView({
      source: {
        uri
      },
      onLoad,
      onError
    });

  if (!hasLoaded) {
    if (error) {
      return (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            marginVertical: 10
          }}
        >
          <Text style={{ marginVertical: 10 }}>
            Could not load image. Please try again.
          </Text>
          <IconButton icon={retryIcon} size={20} onPress={retry} />
        </View>
      );
    }

    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          paddingTop: 10,
          paddingBottom: 10
        }}
      >
        <ActivityIndicator
          size={25}
          color={paperTheme.colors.primary}
        />
      </View>
    );
  }

  const viewProps = getViewProps();
  const imageProps = getImageProps();

  return (
    <View {...viewProps} style={[viewProps.style, viewStyle]}>
      <Image
        {...imageProps}
        style={[imageProps.style, imageStyle]}
      />
    </View>
  );
}

export default React.memo(ResponsiveImage);
