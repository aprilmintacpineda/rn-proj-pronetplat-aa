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
      provider: 'Ionicons',
      name: 'ios-settings-outline'
    },
    onPress: openSettings
  }
];

function renderItem ({ item }) {
  console.log('target', item);

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
        <RNVectorIcon
          size={25}
          color={paperTheme.colors.primary}
          {...icon}
        />
        <Text
          style={{
            marginLeft: 30
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
