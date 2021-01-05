import React from 'react';
import useFluxibleStore from 'react-fluxible/lib/useFluxibleStore';
import { View } from 'react-native';
import { Badge } from 'react-native-paper';
import Feather from 'react-native-vector-icons/Feather';

function mapStates ({ receivedContactRequestCount, notificationsCount }) {
  return { receivedContactRequestCount, notificationsCount };
}

function ToggleDrawerIcon (props) {
  const { receivedContactRequestCount, notificationsCount } = useFluxibleStore(mapStates);
  const badge = receivedContactRequestCount + notificationsCount;

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
