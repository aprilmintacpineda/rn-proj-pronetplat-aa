import React from 'react';
import { Divider } from 'react-native-paper';

function ListItemSeparator () {
  return <Divider style={{ backgroundColor: '#b3b3b3' }} />;
}

export default React.memo(ListItemSeparator);
