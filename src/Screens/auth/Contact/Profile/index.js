import { differenceInDays } from 'date-fns';
import React from 'react';
import { Alert, ScrollView, View } from 'react-native';
import { Divider, Headline, Text } from 'react-native-paper';
import {
  Placeholder,
  PlaceholderLine,
  PlaceholderMedia,
  ShineOverlay
} from 'rn-placeholder';
import ContactDetailRow from './Row';
import Button from 'components/Button';
import Caption from 'components/Caption';
import RNVectorIcon from 'components/RNVectorIcon';
import TimeAgo from 'components/TimeAgo';
import UserAvatar from 'components/UserAvatar';
import {
  closeLoadingOverlay,
  openLoadingOverlay,
  showRequestFailedPopup
} from 'fluxible/actions/popup';
import useDataFetch from 'hooks/useDataFetch';
import {
  getFullName,
  renderContactTitle,
  sendContactRequest
} from 'libs/contact';
import { xhr } from 'libs/xhr';
import { paperTheme } from 'theme';

function ContactProfile ({
  route: { params: contactData },
  navigation: { setOptions, goBack }
}) {
  const fullName = getFullName(contactData);
  const [isDisabled, setIsDisabled] = React.useState(false);

  const onSuccess = React.useCallback(() => {
    setIsDisabled(false);
  }, []);

  const {
    data,
    isError,
    error,
    refreshData,
    isRefreshing
  } = useDataFetch({
    endpoint: `/contacts/${contactData.id}`,
    onSuccess
  });

  React.useEffect(() => {
    if (isRefreshing && isDisabled) setIsDisabled(false);
  }, [isRefreshing, isDisabled]);

  const sendFollowUp = React.useCallback(async () => {
    try {
      setIsDisabled(true);
      await xhr('/send-follow-up', {
        method: 'post',
        body: { contactId: contactData.id }
      });
    } catch (error) {
      console.log(error);
      showRequestFailedPopup();
    } finally {
      setIsDisabled(false);
      refreshData();
    }
  }, [refreshData, contactData.id]);

  const sendRequest = React.useCallback(() => {
    setIsDisabled(true);
    sendContactRequest(contactData, refreshData);
  }, [contactData, refreshData]);

  const confirmCancelContactRequest = React.useCallback(async () => {
    try {
      setIsDisabled(true);
      await xhr('/cancel-contact-request', {
        method: 'post',
        body: { contactId: contactData.id }
      });
    } catch (error) {
      console.log('error', error);
      showRequestFailedPopup();
    } finally {
      refreshData();
    }
  }, [refreshData, contactData.id]);

  const cancelContactRequest = React.useCallback(() => {
    Alert.alert(
      null,
      `Are you sure you want to cancel your contact request to ${fullName}?`,
      [
        {
          text: 'No',
          style: 'cancel'
        },
        {
          text: 'Yes',
          style: 'destructive',
          onPress: confirmCancelContactRequest
        }
      ]
    );
  }, [fullName, confirmCancelContactRequest]);

  const contactDetails = React.useMemo(() => {
    if (isError) {
      if (error.status === 404) {
        return (
          <View
            style={{
              marginHorizontal: 15,
              marginTop: 50
            }}
          >
            <Button
              onPress={sendRequest}
              mode="contained"
              disabled={isDisabled}
            >
              Send contact request
            </Button>
          </View>
        );
      }

      return null;
    }

    if (
      !data ||
      ((data.sentContactRequest || data.receivedContactRequest) &&
        isRefreshing)
    ) {
      return (
        <Placeholder Animation={ShineOverlay}>
          <View style={{ margin: 15 }}>
            <PlaceholderLine width={30} height={8} />
            <View
              style={{
                marginLeft: 15,
                marginBottom: 15,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <PlaceholderLine width={50} />
              <PlaceholderMedia
                style={{ borderRadius: 100 }}
                size={50}
              />
            </View>
            <View
              style={{
                marginLeft: 15,
                marginBottom: 15,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <PlaceholderLine width={50} />
              <PlaceholderMedia
                style={{ borderRadius: 100 }}
                size={50}
              />
            </View>
          </View>
        </Placeholder>
      );
    }

    if (data.sentContactRequest) {
      const {
        sentContactRequest: { createdAt, lastFollowUpAt }
      } = data;

      return (
        <View
          style={{
            marginHorizontal: 15,
            marginTop: 50
          }}
        >
          {differenceInDays(new Date(), new Date(createdAt)) >= 1 ? (
            !lastFollowUpAt ||
            differenceInDays(new Date(), new Date(lastFollowUpAt)) >=
              1 ? (
              <Button
                mode="contained"
                onPress={sendFollowUp}
                disabled={isDisabled}
                style={{ marginBottom: 15 }}
              >
                Send follow up
              </Button>
            ) : (
              <Text
                style={{
                  textAlign: 'center',
                  fontWeight: 'bold',
                  marginBottom: 30
                }}
              >
                You have just sent a follow up{' '}
                <TimeAgo dateFrom={lastFollowUpAt} />
              </Text>
            )
          ) : (
            <Text
              style={{
                textAlign: 'center',
                fontWeight: 'bold',
                marginBottom: 30
              }}
            >
              You have just sent your contact request{' '}
              <TimeAgo dateFrom={createdAt} />
            </Text>
          )}
          <Button
            color={paperTheme.colors.error}
            mode="outlined"
            onPress={cancelContactRequest}
            disabled={isDisabled}
          >
            Cancel contact request
          </Button>
        </View>
      );
    }

    const types = {
      email: {
        data: [],
        labels: {
          plural: 'Emails',
          singular: 'Email'
        }
      },
      mobile: {
        data: [],
        labels: {
          plural: 'Mobile numbers',
          singular: 'Mobile number'
        }
      },
      telephone: {
        data: [],
        labels: {
          plural: 'Telephone numbers',
          singular: 'Telephone number'
        }
      }
    };

    data.forEach(contactData => {
      const { type } = contactData;
      types[type].data.push(
        <ContactDetailRow
          key={contactData.id}
          disabled={isDisabled}
          {...contactData}
        />
      );
    });

    const groupedData = Object.keys(types).reduce(
      (accumulator, group) => {
        const { data, labels } = types[group];
        const { plural, singular } = labels;
        const { length } = data;

        if (length > 0) {
          return accumulator.concat({
            data,
            label: length > 1 ? plural : singular
          });
        }

        return accumulator;
      },
      []
    );

    const groupLastIndex = groupedData.length - 1;

    return (
      <View style={{ margin: 15 }}>
        {groupedData.map(({ label, data }, index) => {
          if (!data.length) return null;

          return (
            <View key={label} style={{ marginBottom: 15 }}>
              <Caption>{label}</Caption>
              {data}
              {index < groupLastIndex ? <Divider /> : null}
            </View>
          );
        })}
      </View>
    );
  }, [
    data,
    isError,
    error,
    sendRequest,
    sendFollowUp,
    isDisabled,
    isRefreshing,
    cancelContactRequest
  ]);

  const confirmRemoveFromContacts = React.useCallback(async () => {
    try {
      openLoadingOverlay();
      setIsDisabled(true);

      await xhr('/remove-from-contacts', {
        method: 'post',
        body: {
          contactId: contactData.id
        }
      });

      goBack();
    } catch (error) {
      console.log(error);
      showRequestFailedPopup();
      setIsDisabled(false);
    } finally {
      closeLoadingOverlay();
    }
  }, [contactData.id, goBack]);

  const removeFromContacts = React.useCallback(() => {
    Alert.alert(
      null,
      `Are you sure you want to remove ${fullName} from your contacts?`,
      [
        {
          text: 'No',
          style: 'cancel'
        },
        {
          text: 'Yes',
          onPress: confirmRemoveFromContacts,
          style: 'destructive'
        }
      ]
    );
  }, [fullName, confirmRemoveFromContacts]);

  React.useEffect(() => {
    setOptions({
      title: fullName,
      actions: [
        {
          title: 'Remove',
          icon: props => (
            <RNVectorIcon
              provider="Ionicons"
              name="ios-trash"
              {...props}
            />
          ),
          onPress: removeFromContacts,
          disabled: isDisabled
        }
      ]
    });
  }, [isDisabled, fullName, removeFromContacts, setOptions]);

  return (
    <ScrollView>
      <View style={{ margin: 15, marginTop: 30 }}>
        <View
          style={{ alignItems: 'center', justifyContent: 'center' }}
        >
          <UserAvatar user={contactData} size={100} />
          <View style={{ marginTop: 15 }}>
            <Headline style={{ textAlign: 'center' }}>
              {fullName}
            </Headline>
            <View style={{ alignItems: 'center' }}>
              {renderContactTitle(contactData)}
            </View>
          </View>
        </View>
        <Text
          style={{
            textAlign: 'center',
            marginTop: 15,
            color: 'gray'
          }}
        >
          {contactData.bio}
        </Text>
      </View>
      {contactDetails}
    </ScrollView>
  );
}

export default React.memo(ContactProfile);
