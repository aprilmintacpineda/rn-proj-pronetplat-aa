import React from 'react';
import { Text } from 'react-native-paper';

function ContactDetailRow (props) {
  console.log('props', props);
  return <Text>ContactDetailRow</Text>;
}

export default React.memo(ContactDetailRow);
