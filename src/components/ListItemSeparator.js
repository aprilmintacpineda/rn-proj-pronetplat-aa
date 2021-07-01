import React from 'react';
import { Divider } from 'react-native-paper';

function ListItemSeparator () {
  return <Divider style={{ backgroundColor: '#ededed' }} />;
}

export default React.memo(ListItemSeparator);
