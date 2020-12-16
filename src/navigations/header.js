import React from 'react';
import { Appbar } from 'react-native-paper';
import Feather from 'react-native-vector-icons/Feather';
import { camelToTitleCase } from 'libs/strings';

function menuIcon (props) {
  return <Feather name="menu" {...props} />;
}

function header (props) {
  const { scene, navigation } = props;
  const { name } = scene.route;
  const { goBack, canGoBack, openDrawer } = navigation;
  const { isMainScreen = false, title = null } = scene.descriptor.options;
  const hasDrawerNavigation = Boolean(openDrawer);

  return (
    <Appbar.Header
      style={{
        backgroundColor: '#fff',
        elevation: 2
      }}>
      {!isMainScreen && canGoBack() ?
        <Appbar.BackAction onPress={goBack} />
       : hasDrawerNavigation ?
        <Appbar.Action icon={menuIcon} onPress={openDrawer} />
       : null}
      <Appbar.Content
        title={title !== null ? title : camelToTitleCase(name)}
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
