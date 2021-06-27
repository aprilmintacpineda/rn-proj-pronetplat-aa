import React from 'react';
import { View } from 'react-native';
import { Badge } from 'react-native-paper';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const icons = {
  Ionicons,
  AntDesign,
  MaterialCommunityIcons,
  Feather
};

function RNVectorIcon ({ provider, badge, ...iconProps }) {
  const Icon = icons[provider];
  return (
    <View style={{ position: 'relative' }}>
      <Icon {...iconProps} />
      <Badge
        style={{ position: 'absolute', top: -8, right: -8 }}
        visible={Boolean(badge)}
      >
        {badge}
      </Badge>
    </View>
  );
}

export default React.memo(RNVectorIcon);
