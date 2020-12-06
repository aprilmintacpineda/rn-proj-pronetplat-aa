import React from 'react';
import { Linking, Text, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import TouchableButton from 'components/TouchableButton';

function ContactDetailRow ({ type, value }) {
  const {
    colors: { primary }
  } = useTheme();

  const iconSize = 20;
  let actionIcon = null;

  switch (type) {
    case 'email':
      actionIcon = <Feather name="send" color={primary} size={iconSize} />;
      break;
    case 'mobile':
      actionIcon = <AntDesign name="message1" size={iconSize} color={primary} />;
      break;
    case 'telephone':
      actionIcon = <Feather name="phone-call" size={iconSize} color={primary} />;
      break;
  }

  const send = React.useCallback(() => {
    let url = null;

    switch (type) {
      case 'email':
        url = `mailto:${value}`;
        break;
      case 'mobile':
        url = `sms:${value}`;
        break;
      case 'telephone':
        url = `tel:${value}`;
        break;
    }

    Linking.openURL(url);
  }, [type, value]);

  return (
    <View
      style={{
        marginBottom: 15,
        marginLeft: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
      <Text style={{ fontSize: 16 }}>{value}</Text>
      <View style={{ backgroundColor: '#d0d1d5', borderRadius: 100, overflow: 'hidden' }}>
        <TouchableButton onPress={send} style={{ padding: 10 }}>
          {actionIcon}
        </TouchableButton>
      </View>
    </View>
  );
}

export default React.memo(ContactDetailRow);
