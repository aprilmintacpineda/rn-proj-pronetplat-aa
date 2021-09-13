import React from 'react';
import { FlatList, View, Linking } from 'react-native';
import { Text } from 'react-native-paper';
import ListItemSeparator from 'components/ListItemSeparator';
import RNVectorIcon from 'components/RNVectorIcon';
import TouchableRipple from 'components/TouchableRipple';
import { paperTheme } from 'theme';

const menuList = [
  {
    title: 'Change my personal information',
    icon: {
      provider: 'MaterialCommunityIcons',
      name: 'account-edit-outline'
    },
    to: 'ChangePersonalInfo'
  },
  {
    title: 'Change my password',
    icon: {
      provider: 'MaterialCommunityIcons',
      name: 'account-key'
    },
    to: 'ChangePassword'
  },
  {
    title: 'My contact details',
    icon: {
      provider: 'MaterialCommunityIcons',
      name: 'card-account-details-outline'
    },
    to: 'ContactDetails'
  },
  {
    title: 'Privacy',
    icon: {
      provider: 'MaterialCommunityIcons',
      name: 'eye-off-outline'
    },
    to: 'PrivacySettings'
  },
  {
    title: 'My  block list',
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
    onPress: () => {
      Linking.openSettings();
    }
  }
];

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
        <RNVectorIcon size={25} {...icon} />
        <Text
          style={{
            marginLeft: 32,
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
