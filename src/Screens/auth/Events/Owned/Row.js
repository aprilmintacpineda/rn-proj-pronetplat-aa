import { format, isSameDay } from 'date-fns';
import { emitEvent } from 'fluxible-js';
import React from 'react';
import { View } from 'react-native';
import { Text, Title } from 'react-native-paper';
import CoverPicture from './CoverPicture';
import Button from 'components/Button';
import Caption from 'components/Caption';
import RNVectorIcon from 'components/RNVectorIcon';
import Surface from 'components/Surface';
import TouchableRipple from 'components/TouchableRipple';
import { unknownErrorPopup } from 'fluxible/actions/popup';
import { xhr } from 'libs/xhr';
import { paperTheme } from 'theme';

function MyEventRow (event) {
  const {
    id,
    name,
    address,
    startDateTime: _startDateTime,
    endDateTime: _endDateTime,
    visibility,
    maxAttendees,
    status,
    isOrganizer
  } = event;

  const startDateTime = new Date(_startDateTime);
  const endDateTime = new Date(_endDateTime);

  const [isPublishing, setIsPublishing] = React.useState(false);

  const publish = React.useCallback(async () => {
    try {
      setIsPublishing(true);
      await xhr(`/event/publish/${id}`, { method: 'post' });
      emitEvent('publishedEvent', id);
      setIsPublishing(false);
    } catch (error) {
      console.log(error);
      unknownErrorPopup();
      setIsPublishing(false);
    }
  }, [id]);

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
            <CoverPicture {...event} />
            <View style={{ padding: 10 }}>
              <Title>{name}</Title>
              {!isOrganizer ? null : (
                <>
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
                  {status === 'published' ? (
                    <View
                      style={{
                        marginBottom: 10,
                        flexDirection: 'row',
                        alignItems: 'flex-start'
                      }}
                    >
                      <RNVectorIcon
                        provider="Ionicons"
                        name="ios-checkmark-circle-outline"
                        color={paperTheme.colors.error}
                        size={20}
                      />
                      <View style={{ marginLeft: 5, flex: 1 }}>
                        <Text
                          style={{ color: paperTheme.colors.error }}
                        >
                          Already published
                        </Text>
                        <Caption>
                          You can no longer edit this because it has
                          already been published,
                        </Caption>
                      </View>
                    </View>
                  ) : (
                    <View
                      style={{
                        marginBottom: 10,
                        flexDirection: 'row',
                        alignItems: 'flex-start'
                      }}
                    >
                      <RNVectorIcon
                        provider="Ionicons"
                        name="ios-alert-circle-outline"
                        color={paperTheme.colors.error}
                        size={20}
                      />
                      <View style={{ marginLeft: 5, flex: 1 }}>
                        <Text
                          style={{ color: paperTheme.colors.error }}
                        >
                          Not yet published
                        </Text>
                        <Caption>
                          You can still edit this because it has not
                          been published yet.
                        </Caption>
                      </View>
                    </View>
                  )}
                </>
              )}
              {visibility === 'public' ? (
                <View
                  style={{
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
                    <View style={{ marginLeft: 5, flex: 1 }}>
                      <Text>
                        On{' '}
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
                    </View>
                  </>
                ) : (
                  <>
                    <View style={{ marginLeft: 5, flex: 1 }}>
                      <Text>
                        From{' '}
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
              {isOrganizer && status === 'unpublished' && (
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
                    Edit
                  </Button>
                  <Button
                    params={event}
                    style={{ flex: 1 }}
                    onPress={publish}
                    loading={isPublishing}
                  >
                    Publish
                  </Button>
                </View>
              )}
            </View>
          </View>
        </TouchableRipple>
      </View>
    </Surface>
  );
}

export default React.memo(MyEventRow);
