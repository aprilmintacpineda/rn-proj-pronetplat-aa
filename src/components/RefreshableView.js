import React from 'react';
import { View } from 'react-native';
import { ActivityIndicator, Title } from 'react-native-paper';
import IconButton from './IconButton';
import RNVectorIcon from './RNVectorIcon';
import { paperTheme } from 'theme';

function refresIcon (props) {
  return (
    <RNVectorIcon provider="Ionicons" name="refresh" {...props} />
  );
}

function RefreshableView ({ children, onRefresh, isRefreshing }) {
  return (
    <View style={{ margin: 15, alignItems: 'center' }}>
      <Title style={{ textAlign: 'center', marginBottom: 15 }}>
        {children}
      </Title>
      {isRefreshing ? (
        <ActivityIndicator color={paperTheme.colors.accent} />
      ) : (
        <IconButton onPress={onRefresh} icon={refresIcon} />
      )}
    </View>
  );
}

export default React.memo(RefreshableView);
