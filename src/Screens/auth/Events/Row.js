import { format, isSameDay } from 'date-fns';
import React from 'react';
import { View } from 'react-native';
import { Text, Title } from 'react-native-paper';
import CoverPicture from './CoverPicture';
import Button from 'components/Button';
import RNVectorIcon from 'components/RNVectorIcon';
import Surface from 'components/Surface';
import { paperTheme } from 'theme';

function MyEventRow (event) {
  const {
    name,
    address,
    startDateTime: _startDateTime,
    endDateTime: _endDateTime
  } = event;

  const startDateTime = new Date(_startDateTime);
  const endDateTime = new Date(_endDateTime);

  return (
    <Surface
      style={{
        margin: 10,
        borderColor: '#ededed',
        borderWidth: 1,
        borderRadius: paperTheme.roundness,
        padding: 0
      }}
    >
      <CoverPicture {...event} />
      <View style={{ padding: 10 }}>
        <Title>{name}</Title>
        <View
          style={{
            marginTop: 10,
            marginBottom: 10,
            flexDirection: 'row'
          }}
        >
          <RNVectorIcon
            provider="Ionicons"
            name="ios-location-outline"
            color={paperTheme.colors.primary}
            size={20}
          />
          <Text style={{ marginLeft: 5 }}>{address}</Text>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <RNVectorIcon
            provider="Ionicons"
            name="ios-time-outline"
            color={paperTheme.colors.primary}
            size={20}
          />
          {isSameDay(startDateTime, endDateTime) ? (
            <>
              <Text style={{ marginLeft: 5 }}>
                On{' '}
                <Text style={{ fontWeight: 'bold' }}>
                  {format(startDateTime, 'cccc, MMMM d, Y')}
                </Text>{' '}
                from{' '}
                <Text style={{ fontWeight: 'bold' }}>
                  {format(startDateTime, 'p')}
                </Text>{' '}
                to{' '}
                <Text style={{ fontWeight: 'bold' }}>
                  {format(endDateTime, 'p')}
                </Text>
              </Text>
            </>
          ) : (
            <>
              <Text style={{ marginLeft: 5 }}>
                From{' '}
                <Text style={{ fontWeight: 'bold' }}>
                  {format(startDateTime, 'cccc, MMMM d, Y')}
                </Text>{' '}
                at{' '}
                <Text style={{ fontWeight: 'bold' }}>
                  {format(startDateTime, 'p')}
                </Text>{' '}
                to{' '}
                <Text style={{ fontWeight: 'bold' }}>
                  {format(endDateTime, 'cccc, MMMM d, Y')}
                </Text>{' '}
                at{' '}
                <Text style={{ fontWeight: 'bold' }}>
                  {format(endDateTime, 'p')}
                </Text>{' '}
              </Text>
            </>
          )}
        </View>
        <Button
          to="EditEvent"
          params={event}
          style={{ marginTop: 10 }}
        >
          Edit
        </Button>
      </View>
    </Surface>
  );
}

export default React.memo(MyEventRow);
