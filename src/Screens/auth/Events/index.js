import React from 'react';
import { Text } from 'react-native-paper';
import RNVectorIcon from 'components/RNVectorIcon';

function Events ({ navigation: { setOptions, navigate } }) {
  React.useEffect(() => {
    setOptions({
      actions: [
        {
          title: 'Create event',
          icon: props => (
            <RNVectorIcon
              provider="MaterialCommunityIcons"
              name="calendar-plus"
              {...props}
            />
          ),
          onPress: () => {
            navigate('CreateEvent');
          }
        }
      ]
    });
  }, [setOptions, navigate]);

  return <Text>Events</Text>;
}

export default React.memo(Events);
