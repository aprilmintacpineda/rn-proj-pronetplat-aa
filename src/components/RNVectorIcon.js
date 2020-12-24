import React from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const icons = {
  Ionicons,
  AntDesign,
  Entypo,
  MaterialCommunityIcons,
  Feather
};

function RNVectorIcon ({ provider, ...iconProps }) {
  const Icon = icons[provider];
  return <Icon {...iconProps} />;
}

export default React.memo(RNVectorIcon);
