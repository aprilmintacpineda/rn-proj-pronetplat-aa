import React from 'react';
import { Divider } from 'react-native-paper';

function ListItemSeparator () {
  return <Divider style={{ marginHorizontal: 15 }} />;
}

export default React.memo(ListItemSeparator);
