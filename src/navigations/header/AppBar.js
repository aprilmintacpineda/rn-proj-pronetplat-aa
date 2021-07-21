import React from 'react';
import { Platform, View } from 'react-native';
import { Appbar, Text } from 'react-native-paper';
import ActionsButton from './ActionsButton';
import ToggleDrawerIcon from './ToggleDrawerIcon';
import RNVectorIcon from 'components/RNVectorIcon';
import { camelToTitleCase } from 'libs/strings';
import { paperTheme } from 'theme';

function menuIcon (toggle) {
  return <ToggleDrawerIcon {...toggle} />;
}

function closeIcon (props) {
  return (
    <RNVectorIcon provider="Ionicons" name="close" {...props} />
  );
}

function backIcon (props) {
  return (
    <RNVectorIcon provider="Ionicons" name="arrow-back" {...props} />
  );
}

function AppBar (props) {
  const { scene, navigation } = props;
  const { name, params } = scene.route;
  const { goBack, canGoBack, openDrawer } = navigation;
  const {
    isMainScreen = false,
    title = null,
    actions,
    button = null,
    resolveAppBarContent,
    isModal
  } = scene.descriptor.options;
  const hasDrawerNavigation = Boolean(openDrawer);
  const appbarContent = resolveAppBarContent
    ? resolveAppBarContent(params)
    : null;

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
        <Appbar.Action
          onPress={goBack}
          icon={isModal ? closeIcon : backIcon}
        />
      ) : hasDrawerNavigation ? (
        <Appbar.Action
          icon={menuIcon}
          onPress={openDrawer}
          style={{ overflow: 'visible' }}
        />
      ) : null}
      <View
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          alignItems: 'flex-start',
          marginLeft: 55,
          marginRight: 10
        }}
      >
        {(appbarContent &&
          typeof appbarContent !== 'string' &&
          appbarContent) || (
          <Text
            style={{
              color: '#fff',
              fontSize: Platform.select({
                ios: 17,
                android: 20
              })
            }}
            numberOfLines={1}
          >
            {title || appbarContent || camelToTitleCase(name)}
          </Text>
        )}
      </View>
      {button}
      {actions && <ActionsButton actions={actions} />}
    </Appbar.Header>
  );
}

export default React.memo(AppBar);
