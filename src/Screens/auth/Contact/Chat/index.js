import React from 'react';
import { Platform, View } from 'react-native';
import { Text } from 'react-native-paper';
import MessageInput from './MessageInput';
import Row from './Row';
import Avatar from 'components/Avatar';
import DataFlatList from 'components/DataFlatList';
import { getFullName } from 'libs/user';

function ContactChat ({
  navigation: { setOptions },
  route: { params: contact }
}) {
  React.useEffect(() => {
    setOptions({
      appbarContentStyle: {
        alignItems: 'flex-start',
        right: 20
      },
      appbarContent: (
        <View
          style={{
            marginLeft: 15,
            flexDirection: 'row',
            alignItems: 'center'
          }}
        >
          <Avatar size={40} uri={contact.profilePicture} />
          <Text
            style={{
              marginLeft: 10,
              color: '#fff',
              fontSize: Platform.select({
                ios: 17,
                android: 20
              }),
              flex: 1
            }}
            numberOfLines={1}
          >
            {getFullName(contact)}
          </Text>
        </View>
      )
    });
  }, [setOptions, contact]);

  return (
    <View style={{ flex: 1 }}>
      <DataFlatList
        inverted
        ItemSeparatorComponent={null}
        endpoint={`/chat-messages/${contact.id}`}
        RowComponent={Row}
        listEmptyMessage="No chat messages yet."
      />
      <MessageInput />
    </View>
  );
}

export default React.memo(ContactChat);
