import React from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import Button from 'components/Button';

function CancelGoing (/**props */) {
  // const [isCancelling, setIsCancelling] = React.useState(false);

  const cancelGoing = React.useCallback(() => {}, []);

  return (
    <View style={{ marginTop: 10 }}>
      <Text>You are going to this event</Text>
      <Button
        mode="contained"
        style={{ marginVertical: 10 }}
        onPress={cancelGoing}
      >
        Cancel
      </Button>
    </View>
  );
}

export default React.memo(CancelGoing);
