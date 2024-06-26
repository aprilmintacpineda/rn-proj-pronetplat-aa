import { useRoute, useNavigation } from '@react-navigation/native';
import { format, isPast, isSameDay } from 'date-fns';
import { addEvent } from 'fluxible-js';
import React from 'react';
import { Platform, ScrollView, View } from 'react-native';
import * as AddCalendarEvent from 'react-native-add-calendar-event';
import { Divider, Text, Title } from 'react-native-paper';
import {
  openSettings,
  PERMISSIONS,
  request
} from 'react-native-permissions';
import CancelGoing from './CancelGoing';
import InviteContacts from './InviteContacts';
import JoinEvent from './JoinEvent';
import RespondToInvitation from './RespondToInvitation';
import Caption from 'components/Caption';
import ResponsiveImageView from 'components/ResponsiveImageView';
import RNVectorIcon from 'components/RNVectorIcon';
import TextLink from 'components/TextLink';
import { showErrorPopup } from 'fluxible/actions/popup';
import { renderLinks } from 'libs/strings';
import { paperTheme } from 'theme';

function ViewEventInfo () {
  const { params: event } = useRoute();
  const { setParams } = useNavigation();
  const {
    name,
    coverPicture,
    visibility,
    maxAttendees,
    address,
    startDateTime: _startDateTime,
    endDateTime: _endDateTime,
    description,
    isOrganizer,
    status,
    numGoing,
    placeName,
    isGoing,
    invitationId
  } = event;

  const addToCalendar = React.useCallback(async () => {
    const results = await request(
      Platform.select({
        ios: PERMISSIONS.IOS.CALENDARS,
        android: PERMISSIONS.ANDROID.WRITE_CALENDAR
      })
    );

    if (results !== 'granted') {
      showErrorPopup({
        message: 'Please allow the app to use your calendar.',
        buttons: [
          {
            label: 'Open Settings',
            onPress: openSettings,
            color: paperTheme.colors.primary,
            mode: 'contained'
          }
        ]
      });

      return;
    }

    AddCalendarEvent.presentEventCreatingDialog({
      title: name,
      startDate: _startDateTime,
      endDate: _endDateTime,
      location: address,
      notes: description
    });
  }, [name, _startDateTime, _endDateTime, address, description]);

  const renderedDescription = React.useMemo(
    () => renderLinks(description),
    [description]
  );

  React.useEffect(() => {
    const unsubscribeListeners = [
      addEvent(
        'websocketEvent-eventInvitationCancelled',
        ({ payload: { event: _event } }) => {
          if (_event.id === event.id) {
            setParams({
              ...event,
              invitationId: null
            });
          }
        }
      ),
      addEvent(
        'websocketEvent-eventInvitation',
        ({
          sender,
          payload: { event: _event, eventInvitation }
        }) => {
          if (_event.id === event.id) {
            setParams({
              ...event,
              invitationId: eventInvitation.id,
              inviter: sender
            });
          }
        }
      )
    ];

    return () => {
      unsubscribeListeners.forEach(unsubscribeListener => {
        unsubscribeListener();
      });
    };
  }, [event, setParams]);

  const startDateTime = new Date(_startDateTime);
  const endDateTime = new Date(_endDateTime);
  const hasEventPast = isPast(startDateTime);

  const directionsUrl =
    Platform.OS === 'android'
      ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
          address
        )}&origin=My+Location`
      : `http://maps.apple.com/?daddr=${encodeURIComponent(
          address
        )}&saddr=My+Location`;

  return (
    <ScrollView>
      <ResponsiveImageView uri={coverPicture} />
      <View style={{ padding: 10 }}>
        <Title style={{ marginBottom: 10 }}>{name}</Title>
        {hasEventPast ? (
          <Text
            style={{
              color: paperTheme.colors.error,
              fontWeight: 'bold'
            }}
          >
            This event has past.
          </Text>
        ) : status === 'published' ? (
          <>
            {invitationId ? (
              <View style={{ marginBottom: 5 }}>
                <RespondToInvitation event={event} />
              </View>
            ) : (
              <>
                {visibility === 'public' ||
                isOrganizer ||
                isGoing ? (
                  <View style={{ marginBottom: 5 }}>
                    <InviteContacts event={event} />
                  </View>
                ) : null}
                {isGoing ? (
                  <View style={{ marginBottom: 5 }}>
                    <CancelGoing event={event} />
                  </View>
                ) : visibility === 'public' && !isOrganizer ? (
                  <View style={{ marginBottom: 5 }}>
                    <JoinEvent event={event} />
                  </View>
                ) : null}
              </>
            )}
          </>
        ) : null}
        <View style={{ marginTop: 10 }}>
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
          {visibility !== 'public' && (
            <View
              style={{
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
                Only invited users can join
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
            <View style={{ marginLeft: 5, flex: 1 }}>
              {placeName && (
                <Text style={{ fontWeight: 'bold' }}>
                  {placeName}
                </Text>
              )}
              {placeName ? (
                <Caption style={{ marginBottom: 10 }}>
                  {address}
                </Caption>
              ) : (
                <Text style={{ marginBottom: 10 }}>{address}</Text>
              )}
              <TextLink isExternal to={directionsUrl}>
                Get directions.
              </TextLink>
            </View>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <RNVectorIcon
              provider="Ionicons"
              name="ios-time-outline"
              color={paperTheme.colors.primary}
              size={20}
            />
            <View style={{ marginLeft: 5, flex: 1 }}>
              {isSameDay(startDateTime, endDateTime) ? (
                <>
                  <Text>
                    {hasEventPast ? 'Last ' : 'On '}
                    <Text style={{ fontWeight: 'bold' }}>
                      {format(startDateTime, 'cccc, MMMM d, Y')}
                    </Text>{' '}
                  </Text>
                  <Text>
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
                  <Text>
                    {hasEventPast ? 'Last ' : 'From '}
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
                </>
              )}
              {!hasEventPast && (
                <TextLink
                  onPress={addToCalendar}
                  style={{ marginTop: 10 }}
                >
                  Add to calendar
                </TextLink>
              )}
            </View>
          </View>
          <Divider style={{ marginVertical: 15 }} />
          <Text>{renderedDescription}</Text>
        </View>
      </View>
    </ScrollView>
  );
}

export default React.memo(ViewEventInfo);
