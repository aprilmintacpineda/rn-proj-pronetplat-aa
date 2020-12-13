import React from 'react';
import { Appbar } from 'react-native-paper';

function header (props) {
  const { scene, navigation } = props;
  const { goBack, canGoBack } = navigation;
  const { isMainScreen = false, title } = scene.descriptor.options;

  return (
    <Appbar.Header
      style={{
        backgroundColor: '#fff',
        elevation: 2
      }}>
      {!isMainScreen && canGoBack() ? <Appbar.BackAction onPress={goBack} /> : null}
      <Appbar.Content
        title={title}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          alignItems: 'center',
          zIndex: -1,
          marginLeft: 0
        }}
      />
    </Appbar.Header>
  );
}

export default header;
