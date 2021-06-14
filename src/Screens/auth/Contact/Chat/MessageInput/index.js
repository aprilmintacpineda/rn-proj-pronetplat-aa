import { useRoute } from '@react-navigation/native';
import { addEvent } from 'fluxible-js';
import React from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import InputBox from './InputBox';
import { getPersonalPronoun } from 'libs/user';

function ChatMessageInput () {
  const { params: contact } = useRoute();
  const [isConnected, setIsConnected] = React.useState(
    contact.isConnected
  );

  React.useEffect(() => {
    const removeListener = addEvent(
      [
        'websocketEvent-blockedByUser',
        'websocketEvent-userDisconected'
      ],
      ({ user }) => {
        if (user.id === contact.id) setIsConnected(true);
      }
    );

    return removeListener;
  }, [contact]);

  if (isConnected) return <InputBox />;

  return (
    <View
      style={{
        borderTopWidth: 1,
        borderTopColor: '#ededed',
        padding: 15
      }}
    >
      <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>
        You cannot reply to this conversation
      </Text>
      <Text>
        Either the user has blocked you or has removed you from{' '}
        {getPersonalPronoun(contact).possessive.lowercase} contacts.
      </Text>
    </View>
  );
}

export default React.memo(ChatMessageInput);
