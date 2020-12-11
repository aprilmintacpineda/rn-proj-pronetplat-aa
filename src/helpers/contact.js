import React from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';

export function getFullName ({ firstName, middleName, lastName }) {
  return `${firstName}${middleName ? ` ${middleName} ` : ' '}${lastName}`;
}

export function renderContactTitle ({ title, company }, viewStyle = null) {
  return (
    <View style={[{ flexDirection: 'row' }, viewStyle]}>
      <Text style={{ fontWeight: 'bold' }}>{title}</Text>
      {company ? (
        <>
          <Text> at </Text>
          <Text style={{ fontWeight: 'bold' }}>{company}</Text>
        </>
      ) : null}
    </View>
  );
}
