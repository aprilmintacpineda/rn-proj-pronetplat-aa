import { format, isPast, isSameDay } from 'date-fns';
import React from 'react';
import { View } from 'react-native';
import { Text, Title } from 'react-native-paper';
import ResponsiveImageView from 'components/ResponsiveImageView';
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
    maxAttendees,
    coverPicture,
    distance,
    numGoing,
    isOrganizer,
    unit
  } = event;

  const startDateTime = new Date(_startDateTime);
  const endDateTime = new Date(_endDateTime);
  const past = isPast(endDateTime);

  return (
    <Surface
      style={{
        margin: 10,
        padding: 0
      }}
    >
      <View style={{ overflow: 'hidden' }}>
        <TouchableRipple
          to="ViewEvent"
          params={event}
          style={{ borderRadius: paperTheme.roundness }}
        >
          <View>
            <ResponsiveImageView
              uri={coverPicture}
              imageStyle={{
                borderTopLeftRadius: paperTheme.roundness,
                borderTopRightRadius: paperTheme.roundness
              }}
            />
            <View style={{ padding: 10 }}>
              <Title>{name}</Title>
              {isOrganizer && (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginBottom: 10
                  }}
                >
                  <RNVectorIcon
                    provider="Ionicons"
                    name="ios-checkmark-circle-outline"
                    color={paperTheme.colors.error}
                    size={20}
                  />
                  <Text
                    style={{
                      marginLeft: 5,
                      color: paperTheme.colors.error
                    }}
                  >
                    You are an organizer
                  </Text>
                </View>
              )}
              <View
                style={{
                  marginBottom: 10,
                  flexDirection: 'row'
                }}
              >
                <RNVectorIcon
                  provider="Ionicons"
                  name="ios-time-outline"
                  color={paperTheme.colors.primary}
                  size={20}
                />
                {isSameDay(startDateTime, endDateTime) ? (
                  <>
                    <View style={{ marginLeft: 5, flex: 1 }}>
                      <Text>
                        {past ? 'Last ' : 'On '}
                        <Text style={{ fontWeight: 'bold' }}>
                          {format(startDateTime, 'cccc, MMMM d, Y')}
                        </Text>{' '}
                      </Text>
                      <Text>
                        From{' '}
                        <Text style={{ fontWeight: 'bold' }}>
                          {format(startDateTime, 'p')}
                        </Text>{' '}
                        to{' '}
                        <Text style={{ fontWeight: 'bold' }}>
                          {format(endDateTime, 'p')}
                        </Text>
                      </Text>
                    </View>
                  </>
                ) : (
                  <>
                    <View style={{ marginLeft: 5, flex: 1 }}>
                      <Text>
                        {past ? 'Last ' : 'From '}
                        <Text style={{ fontWeight: 'bold' }}>
                          {format(startDateTime, 'cccc, MMMM d, Y')}
                        </Text>{' '}
                        at{' '}
                        <Text style={{ fontWeight: 'bold' }}>
                          {format(startDateTime, 'p')}
                        </Text>{' '}
                      </Text>
                      <Text>
                        to{' '}
                        <Text style={{ fontWeight: 'bold' }}>
                          {format(endDateTime, 'cccc, MMMM d, Y')}
                        </Text>{' '}
                        at{' '}
                        <Text style={{ fontWeight: 'bold' }}>
                          {format(endDateTime, 'p')}
                        </Text>{' '}
                      </Text>
                    </View>
                  </>
                )}
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
                <View style={{ marginLeft: 5 }}>
                  <Text>{address}</Text>
                  <Text style={{ marginTop: 5, fontWeight: 'bold' }}>
                    {Math.ceil(distance)} {unit} away
                  </Text>
                </View>
              </View>
              <View
                style={{
                  marginBottom: 10,
                  flexDirection: 'row'
                }}
              >
                <RNVectorIcon
                  provider="Ionicons"
                  name="people-outline"
                  color={paperTheme.colors.primary}
                  size={20}
                />
                <View style={{ marginLeft: 5 }}>
                  <Text>
                    {Number(numGoing).toLocaleString()} people going.
                  </Text>
                  <Text>
                    Max of {Number(maxAttendees).toLocaleString()}{' '}
                    attendees.
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </TouchableRipple>
      </View>
    </Surface>
  );
}

export default React.memo(MyEventRow);
