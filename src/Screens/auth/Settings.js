import React from 'react';
import { FlatList, View } from 'react-native';
import { Text } from 'react-native-paper';
import ListItemSeparator from 'components/ListItemSeparator';
import RNVectorIcon from 'components/RNVectorIcon';
import TouchableButtonLink from 'components/TouchableButtonLink';

const menuList = [
  {
    title: 'Block list',
    icon: (
      <RNVectorIcon
        size={35}
        provider="MaterialCommunityIcons"
        name="qrcode-remove"
      />
    ),
    to: 'BlockList'
  }
];

function renderItem ({ item }) {
  console.log('target', item);

  const { title, icon, to } = item;

  return (
    <TouchableButtonLink to={to}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          padding: 15
        }}
      >
        {icon}
        <Text
          style={{
            marginLeft: 30
          }}
        >
          {title}
        </Text>
      </View>
    </TouchableButtonLink>
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
