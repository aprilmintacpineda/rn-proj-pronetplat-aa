import React from 'react';
import { View } from 'react-native';
import { Appbar } from 'react-native-paper';
import ActionsButton from './ActionsButton';
import ToggleDrawerIcon from './ToggleDrawerIcon';
import { camelToTitleCase } from 'libs/strings';
import { paperTheme } from 'theme';

function menuIcon (toggle) {
  return <ToggleDrawerIcon {...toggle} />;
}

function AppBar (props) {
  const { scene, navigation } = props;
  const { name } = scene.route;
  const { goBack, canGoBack, openDrawer } = navigation;
  const {
    isMainScreen = false,
    title = null,
    actions,
    button = null,
    appbarContent,
    appbarContentStyle
  } = scene.descriptor.options;
  const hasDrawerNavigation = Boolean(openDrawer);

  return (
    <Appbar.Header
      style={{
        backgroundColor: paperTheme.colors.accent,
        elevation: 2,
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 0
      }}
    >
      {!isMainScreen && canGoBack() ? (
        <Appbar.BackAction onPress={goBack} />
      ) : hasDrawerNavigation ? (
        <Appbar.Action
          icon={menuIcon}
          onPress={openDrawer}
          style={{ overflow: 'visible' }}
        />
      ) : null}
      <View
        style={[
          {
            position: 'absolute',
            left: 0,
            right: 0,
            alignItems: 'center',
            zIndex: -1,
            marginLeft: 0
          },
          appbarContentStyle
        ]}
      >
        {appbarContent || (
          <Appbar.Content
            title={title !== null ? title : camelToTitleCase(name)}
          />
        )}
      </View>
      {button}
      {actions && <ActionsButton actions={actions} />}
    </Appbar.Header>
  );
}

export default React.memo(AppBar);
