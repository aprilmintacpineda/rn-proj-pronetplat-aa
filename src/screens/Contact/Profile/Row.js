import React from 'react';
import { Text, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

function ContactDetailRow ({ type, value }) {
  const { colors: { primary } } = useTheme();

  const iconSize = 30;
  let icon = null;

  switch (type) {
    case 'email':
      icon = <Entypo name="email" size={iconSize} color={primary} />;
      break;
    case 'mobile':
      icon = <Entypo name="mobile" size={iconSize} color={primary} />;
      break;
    case 'telephone':
      icon = <MaterialCommunityIcons name="phone-classic" size={iconSize} color={primary} />;
      break;
  }

  return (
    <View style={{ margin: 15, flexDirection: 'row', alignItems: 'center' }}>
      {icon}
      <Text style={{ marginLeft: 15 }}>{value}</Text>
    </View>
  );
}

export default React.memo(ContactDetailRow);