import React from 'react';
import { Text } from 'react-native-paper';
import CenteredSurface from './CenteredSurface';

function ListEmpty () {
  return (
    <CenteredSurface>
      <Text>There is nothing here.</Text>
    </CenteredSurface>
  );
}

export default React.memo(ListEmpty);
