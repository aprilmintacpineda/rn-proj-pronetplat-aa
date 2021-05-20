import { useRoute } from '@react-navigation/core';
import React from 'react';
import { TextInput, View } from 'react-native';
import IconButton from 'components/IconButton';
import RNVectorIcon from 'components/RNVectorIcon';
import { xhr } from 'libs/xhr';

function SendIcon () {
  return (
    <RNVectorIcon
      provider="Ionicons"
      name="ios-arrow-undo-outline"
      color="#fff"
      size={30}
    />
  );
}

function ChatMessageInput () {
  const { params: contact } = useRoute();
  const [messageBody, setMessageBody] = React.useState('');

  const send = React.useCallback(async () => {
    if (!messageBody) return;

    setMessageBody('');

    let chatMessage = await xhr(`/send-chat-message/${contact.id}`, {
      method: 'post',
      body: { messageBody }
    });

    chatMessage = await chatMessage.json();

    console.log('chatMessage', JSON.stringify(chatMessage, null, 2));
  }, [messageBody, contact]);

  return (
    <View
      style={{
        borderTopWidth: 1,
        borderTopColor: '#d0d1d5',
        flexDirection: 'row',
        padding: 15,
        alignItems: 'center'
      }}
    >
      <View style={{ flex: 1, marginRight: 15 }}>
        <TextInput
          value={messageBody}
          onChangeText={setMessageBody}
          multiline
          placeholder="Send a message"
        />
      </View>
      <View style={{ alignSelf: 'flex-end' }}>
        <IconButton
          onPress={send}
          icon={SendIcon}
          disabled={!messageBody}
        />
      </View>
    </View>
  );
}

export default React.memo(ChatMessageInput);
