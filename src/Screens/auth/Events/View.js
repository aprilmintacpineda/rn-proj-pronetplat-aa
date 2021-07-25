import { format, isSameDay } from 'date-fns';
import React from 'react';
import { Platform, View } from 'react-native';
import {
  Divider,
  Subheading,
  Text,
  Title
} from 'react-native-paper';
import ResponsiveImageView from 'components/ResponsiveImageView';
import RNVectorIcon from 'components/RNVectorIcon';
import TextLink from 'components/TextLink';
import { paperTheme } from 'theme';

function ViewEvent ({ route: { params: event } }) {
  const {
    name,
    coverPicture,
    visibility,
    maxAttendees,
    address,
    startDateTime: _startDateTime,
    endDateTime: _endDateTime,
    description
  } = event;

  const startDateTime = new Date(_startDateTime);
  const endDateTime = new Date(_endDateTime);

  const directionsUrl =
    Platform.OS === 'android'
      ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
          address
        )}&origin=My+Location`
      : `http://maps.apple.com/?daddr=${encodeURIComponent(
          address
        )}&saddr=My+Location`;

  return (
    <View>
      <ResponsiveImageView uri={coverPicture} />
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
          <Text style={{ marginLeft: 5, flex: 1 }}>
            <Text>{address}. </Text>
            <TextLink isExternal to={directionsUrl}>
              Get directions.
            </TextLink>
          </Text>
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
              <Text style={{ marginLeft: 5, flex: 1 }}>
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
        <Divider style={{ marginTop: 10, marginBottom: 5 }} />
        <Subheading style={{ marginBottom: 5 }}>
          Description
        </Subheading>
        <Text>{description}</Text>
      </View>
    </View>
  );
}

export default React.memo(ViewEvent);
