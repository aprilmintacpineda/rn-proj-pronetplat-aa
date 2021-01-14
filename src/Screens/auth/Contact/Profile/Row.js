import React from 'react';
import { Linking, Text, View } from 'react-native';
import { TouchableRipple } from 'react-native-paper';
import RNVectorIcon from 'components/RNVectorIcon';
import { paperTheme } from 'theme';

const { primary, rippleColor } = paperTheme.colors.primary;

function ContactDetailRow ({ type, value }) {
  const iconSize = 20;
  let actionIcon = null;

  switch (type) {
    case 'email':
      actionIcon = (
        <RNVectorIcon
          provider="Feather"
          name="send"
          color={primary}
          size={iconSize}
        />
      );
      break;
    case 'mobile':
      actionIcon = (
        <RNVectorIcon
          provider="AntDesign"
          name="message1"
          size={iconSize}
          color={primary}
        />
      );
      break;
    case 'telephone':
      actionIcon = (
        <RNVectorIcon
          provider="Feather"
          name="phone-call"
          size={iconSize}
          color={primary}
        />
      );
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
      }}
    >
      <Text style={{ fontSize: 16 }}>{value}</Text>
      <View
        style={{
          backgroundColor: '#d0d1d5',
          borderRadius: 100,
          overflow: 'hidden'
        }}
      >
        <TouchableRipple
          onPress={send}
          style={{ padding: 10 }}
          rippleColor={rippleColor}
        >
          {actionIcon}
        </TouchableRipple>
      </View>
    </View>
  );
}

export default React.memo(ContactDetailRow);
