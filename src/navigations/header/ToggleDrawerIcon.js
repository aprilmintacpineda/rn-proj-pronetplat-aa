import React from 'react';
import useFluxibleStore from 'react-fluxible/lib/useFluxibleStore';
import { View } from 'react-native';
import { Badge } from 'react-native-paper';
import Feather from 'react-native-vector-icons/Feather';

function mapStates ({ contactRequestNum, notificationsNum }) {
  return { contactRequestNum, notificationsNum };
}

function ToggleDrawerIcon (props) {
  const { contactRequestNum, notificationsNum } = useFluxibleStore(mapStates);
  const badge = contactRequestNum + notificationsNum;

  return (
    <View style={{ position: 'relative' }}>
      <Feather name="menu" {...props} />
      <Badge
        style={{ position: 'absolute', top: -5, right: -8, zIndex: 1 }}
        visible={badge > 0}>
        {badge}
      </Badge>
    </View>
  );
}

export default React.memo(ToggleDrawerIcon);
