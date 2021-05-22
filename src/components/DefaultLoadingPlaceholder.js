import React from 'react';
import { ActivityIndicator } from 'react-native-paper';
import { paperTheme } from 'theme';

function DefaultLoadingPlaceholder ({ isFetching }) {
  if (!isFetching) return null;

  return (
    <ActivityIndicator
      style={{ margin: 15 }}
      size={25}
      color={paperTheme.colors.primary}
    />
  );
}

export default React.memo(DefaultLoadingPlaceholder);
