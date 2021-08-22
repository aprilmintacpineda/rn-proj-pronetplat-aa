import React from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import Caption from 'components/Caption';
import TimeAgo from 'components/TimeAgo';

function EditHistoryRow ({ data, createdAt }) {
  return (
    <View style={{ paddingVertical: 10 }}>
      <Text>{data.comment}</Text>
      <Caption style={{ marginTop: 5 }}>
        <TimeAgo dateFrom={createdAt} />
      </Caption>
    </View>
  );
}

export default React.memo(EditHistoryRow);
