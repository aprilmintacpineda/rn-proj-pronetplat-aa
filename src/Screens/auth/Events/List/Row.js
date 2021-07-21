import { format, isSameDay } from 'date-fns';
import React from 'react';
import { View } from 'react-native';
import { Text, Title } from 'react-native-paper';
import CoverPicture from './CoverPicture';
import Button from 'components/Button';
import RNVectorIcon from 'components/RNVectorIcon';
import Surface from 'components/Surface';
import TouchableRipple from 'components/TouchableRipple';
import { paperTheme } from 'theme';

function MyEventRow (event) {
  const {
    name,
    address,
    startDateTime: _startDateTime,
    endDateTime: _endDateTime,
    visibility,
    maxAttendees
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
      <TouchableRipple
        to="ViewEvent"
        params={event}
        style={{ borderRadius: paperTheme.roundness }}
      >
        <View>
          <CoverPicture {...event} />
          <View style={{ padding: 10 }}>
            <Title>{name}</Title>
            {visibility === 'public' ? (
              <View
                style={{
                  marginTop: 10,
                  marginBottom: 10,
                  flexDirection: 'row',
                  alignItems: 'center'
                }}
              >
                <RNVectorIcon
                  provider="Ionicons"
                  name="earth-outline"
                  color={paperTheme.colors.primary}
                  size={20}
                />
                <Text style={{ marginLeft: 5 }}>
                  Anyone can view and join
                </Text>
              </View>
            ) : (
              <View
                style={{
                  marginTop: 10,
                  marginBottom: 10,
                  flexDirection: 'row',
                  alignItems: 'center'
                }}
              >
                <RNVectorIcon
                  provider="Ionicons"
                  name="lock-closed-outline"
                  color={paperTheme.colors.primary}
                  size={20}
                />
                <Text style={{ marginLeft: 5 }}>
                  Only invited can view and join
                </Text>
              </View>
            )}
            <View
              style={{
                marginBottom: 10,
                flexDirection: 'row',
                alignItems: 'center'
              }}
            >
              <RNVectorIcon
                provider="Ionicons"
                name="people-outline"
                color={paperTheme.colors.primary}
                size={20}
              />
              <Text style={{ marginLeft: 5 }}>
                Limited to {Number(maxAttendees).toLocaleString()}{' '}
                attendees
              </Text>
            </View>
            <View
              style={{
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
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 10,
                borderTopWidth: 1,
                borderTopColor: '#ededed',
                paddingTop: 5
              }}
            >
              <Button
                to="EditEvent"
                params={event}
                style={{ flex: 1 }}
              >
                Edit details
              </Button>
              <Button
                to="EditEvent"
                params={event}
                style={{ flex: 1 }}
              >
                Organizers
              </Button>
            </View>
          </View>
        </View>
      </TouchableRipple>
    </Surface>
  );
}

export default React.memo(MyEventRow);
