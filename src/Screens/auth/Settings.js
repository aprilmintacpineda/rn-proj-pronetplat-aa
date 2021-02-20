import color from 'color';
import React from 'react';
import { FlatList, View } from 'react-native';
import { Text } from 'react-native-paper';
import { openSettings } from 'react-native-permissions';
import ListItemSeparator from 'components/ListItemSeparator';
import RNVectorIcon from 'components/RNVectorIcon';
import TouchableRipple from 'components/TouchableRipple';
import { paperTheme } from 'theme';

const menuList = [
  {
    title: 'Change Personal Information',
    icon: {
      provider: 'MaterialCommunityIcons',
      name: 'account-edit-outline'
    },
    to: 'ChangePersonalInfo'
  },
  {
    title: 'Change Password',
    icon: {
      provider: 'MaterialCommunityIcons',
      name: 'shield-key-outline'
    },
    to: 'ChangePassword'
  },
  {
    title: 'Block list',
    icon: {
      provider: 'MaterialCommunityIcons',
      name: 'qrcode-remove'
    },
    to: 'BlockList'
  },
  {
    title: 'App settings',
    icon: {
      provider: 'MaterialCommunityIcons',
      name: 'cellphone-cog'
    },
    onPress: openSettings
  }
];

const contentColor = color(paperTheme.colors.text)
  .alpha(0.68)
  .string();

function renderItem ({ item }) {
  const { title, icon, to, onPress } = item;

  return (
    <TouchableRipple to={to} onPress={onPress}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          padding: 15
        }}
      >
        <RNVectorIcon size={25} color={contentColor} {...icon} />
        <Text
          style={{
            marginLeft: 32,
            color: contentColor,
            ...paperTheme.fonts.medium
          }}
        >
          {title}
        </Text>
      </View>
    </TouchableRipple>
  );
}

function keyExtractor (item) {
  return item.title;
}

function Settings () {
  return (
    <FlatList
      data={menuList}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      ItemSeparatorComponent={ListItemSeparator}
    />
  );
}

export default React.memo(Settings);
