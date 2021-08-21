import React from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import Caption from 'components/Caption';
import TimeAgo from 'components/TimeAgo';

function EditHistoryRow ({ fromData, toData, createdAt }) {
  return (
    <View style={{ paddingVertical: 10 }}>
      <Text>
        <Text style={{ fontWeight: 'bold' }}>From: </Text>
        <Text>{fromData.comment}</Text>
      </Text>
      <Text style={{ marginTop: 5 }}>
        <Text style={{ fontWeight: 'bold' }}>To: </Text>
        <Text>{toData.comment}</Text>
      </Text>
      <Caption style={{ marginTop: 5 }}>
        <TimeAgo dateFrom={createdAt} />
      </Caption>
    </View>
  );
}

export default React.memo(EditHistoryRow);
