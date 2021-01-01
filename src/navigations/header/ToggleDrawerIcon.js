import React from 'react';
import useFluxibleStore from 'react-fluxible/lib/useFluxibleStore';
import { View } from 'react-native';
import { Badge } from 'react-native-paper';
import Feather from 'react-native-vector-icons/Feather';

function mapStates ({ contactRequestNum }) {
  return { contactRequestNum };
}

function ToggleDrawerIcon (props) {
  const { contactRequestNum } = useFluxibleStore(mapStates);

  return (
    <View style={{ position: 'relative' }}>
      <Feather name="menu" {...props} />
      <Badge
        style={{ position: 'absolute', top: -5, right: -8, zIndex: 1 }}
        visible={contactRequestNum > 0}>
        {contactRequestNum}
      </Badge>
    </View>
  );
}

export default React.memo(ToggleDrawerIcon);
