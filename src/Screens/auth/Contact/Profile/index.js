import { emitEvent, store, updateStore } from 'fluxible-js';
import React from 'react';
import { ScrollView, View, Alert } from 'react-native';
import { Headline, Text, Divider } from 'react-native-paper';
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
import { showRequestFailedPopup } from 'fluxible/actions/popup';
import useDataFetch from 'hooks/useDataFetch';
import {
  getFullName,
  renderUserTitle,
  getPersonalPronoun
} from 'libs/user';
import { xhr } from 'libs/xhr';
import { paperTheme } from 'theme';

function ContactProfile ({
  route: { params: contactData },
  navigation: { setOptions }
}) {
  const fullName = getFullName(contactData);
  const [isDisabled, setIsDisabled] = React.useState(false);

  const {
    isError,
    error,
    data,
    isRefreshing,
    refreshData,
    isFirstFetch
  } = useDataFetch({
    endpoint: `/contacts/${contactData.id}`
  });

  React.useEffect(() => {
    if (isRefreshing && isDisabled) setIsDisabled(false);
  }, [isRefreshing, isDisabled]);

  const confirmUnblockUser = React.useCallback(async () => {
    try {
      setIsDisabled(true);

      await xhr('/unblock-user', {
        method: 'post',
        body: {
          contactId: contactData.id
        }
      });

      emitEvent('userUnblocked', contactData.id);
    } catch (error) {
      console.log(error);
      showRequestFailedPopup();
    } finally {
      refreshData();
    }
  }, [contactData.id, refreshData]);

  const unblockUser = React.useCallback(() => {
    const personalPronoun = getPersonalPronoun(contactData);

    Alert.alert(
      null,
      `Are you sure you want to unblock ${fullName}? ${personalPronoun.subjective.ucfirst} will be able to send you a contact request again.`,
      [
        {
          text: 'No',
          style: 'cancel'
        },
        {
          text: 'Yes',
          style: 'destructive',
          onPress: confirmUnblockUser
        }
      ]
    );
  }, [fullName, contactData, confirmUnblockUser]);

  const confirmBlockUser = React.useCallback(async () => {
    try {
      setIsDisabled(true);

      await xhr('/block-user', {
        method: 'post',
        body: {
          contactId: contactData.id
        }
      });

      emitEvent('userBlocked', contactData.id);
    } catch (error) {
      console.log(error);
      showRequestFailedPopup();
    } finally {
      refreshData();
    }
  }, [contactData.id, refreshData]);

  const blockUser = React.useCallback(() => {
    const personalPronoun = getPersonalPronoun(contactData);

    Alert.alert(
      null,
      `Are you sure you want to block ${fullName}? ${personalPronoun.subjective.ucfirst} will no longer be able to see your contact details and ${personalPronoun.subjective.lowercase} will be removed from your contacts.`,
      [
        {
          text: 'No',
          style: 'cancel'
        },
        {
          text: 'Yes',
          onPress: confirmBlockUser,
          style: 'destructive'
        }
      ]
    );
  }, [confirmBlockUser, fullName, contactData]);

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
      refreshData();
    }
  }, [refreshData, contactData.id]);

  const sendRequest = React.useCallback(async () => {
    try {
      setIsDisabled(true);

      await xhr('/add-to-contacts', {
        method: 'post',
        body: { contactId: contactData.id }
      });
    } catch (error) {
      console.log(error);
      showRequestFailedPopup();
    } finally {
      refreshData();
    }
    setIsDisabled(true);
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

  const acceptContactRequest = React.useCallback(async () => {
    try {
      setIsDisabled(true);

      await xhr('/accept-contact-request', {
        method: 'post',
        body: { senderId: contactData.id }
      });

      updateStore({
        authUser: {
          ...store.authUser,
          receivedContactRequestsCount:
            store.authUser.receivedContactRequestsCount - 1
        }
      });

      emitEvent('respondedToContactRequest', contactData.id);
    } catch (error) {
      console.log(error);
      showRequestFailedPopup();
    } finally {
      refreshData();
    }
  }, [contactData.id, refreshData]);

  const declineContactRequest = React.useCallback(async () => {
    try {
      setIsDisabled(true);

      await xhr('/decline-contact-request', {
        method: 'post',
        body: { senderId: contactData.id }
      });

      updateStore({
        authUser: {
          ...store.authUser,
          receivedContactRequestsCount:
            store.authUser.receivedContactRequestsCount - 1
        }
      });

      emitEvent('respondedToContactRequest', contactData.id);
    } catch (error) {
      console.log(error);
      showRequestFailedPopup();
    } finally {
      refreshData();
    }
  }, [contactData.id, refreshData]);

  const confirmRemoveFromContacts = React.useCallback(async () => {
    try {
      setIsDisabled(true);

      await xhr('/remove-from-contacts', {
        method: 'post',
        body: {
          contactId: contactData.id
        }
      });
    } catch (error) {
      console.log(error);
      showRequestFailedPopup();
    } finally {
      refreshData();
    }
  }, [contactData.id, refreshData]);

  React.useEffect(() => {
    const actions = [];

    if (
      !isError &&
      !isFirstFetch &&
      !isRefreshing &&
      data &&
      !data.sentContactRequest &&
      !data.receivedContactRequest
    ) {
      if (!data.contactBlocked) {
        actions.push({
          title: 'Remove',
          icon: props => (
            <RNVectorIcon
              provider="Ionicons"
              name="ios-trash"
              {...props}
            />
          ),
          onPress: () => {
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
          },
          disabled: isDisabled
        });
      }

      if (!data.blockedByUser && !data.contactBlocked) {
        actions.push({
          title: 'Block',
          icon: props => (
            <RNVectorIcon
              provider="Entypo"
              name="block"
              {...props}
            />
          ),
          onPress: blockUser,
          disabled: isDisabled
        });
      }
    }

    setOptions({
      title: fullName,
      actions
    });
  }, [
    isDisabled,
    fullName,
    confirmRemoveFromContacts,
    setOptions,
    confirmBlockUser,
    blockUser,
    data,
    isError,
    isFirstFetch,
    isRefreshing
  ]);

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
              style={{ marginBottom: 15 }}
            >
              Send contact request
            </Button>
            <Button
              onPress={blockUser}
              mode="contained"
              disabled={isDisabled}
              color={paperTheme.colors.error}
            >
              Block
            </Button>
          </View>
        );
      }

      return null;
    }

    if (
      !data ||
      ((data.sentContactRequest ||
        data.receivedContactRequest ||
        data.blockedByUser ||
        data.contactBlocked) &&
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

    if (data.blockedByUser || data.contactBlocked) {
      return (
        <View
          style={{
            marginHorizontal: 15,
            marginTop: 50
          }}
        >
          <Text
            style={{
              color: paperTheme.colors.error,
              textAlign: 'center',
              fontWeight: 'bold'
            }}
          >
            {data.contactBlocked
              ? `You have blocked ${fullName}.`
              : `${fullName} has blocked you.`}
          </Text>
          {data.contactBlocked ? (
            <Button
              onPress={unblockUser}
              mode="contained"
              disabled={isDisabled}
              color={paperTheme.colors.error}
              style={{ marginTop: 15 }}
            >
              Unblock
            </Button>
          ) : null}
        </View>
      );
    }

    if (data.sentContactRequest) {
      const {
        sentContactRequest: { createdAt, canFollowUpAt }
      } = data;

      return (
        <View
          style={{
            marginHorizontal: 15,
            marginTop: 50
          }}
        >
          <Text
            style={{
              textAlign: 'center',
              fontWeight: 'bold',
              marginBottom: 30
            }}
          >
            Contact request sent <TimeAgo dateFrom={createdAt} />
          </Text>
          <Button
            mode="contained"
            onPress={sendFollowUp}
            disabled={isDisabled}
            style={{ marginBottom: 15 }}
            countDown={{
              toTime: canFollowUpAt
            }}
          >
            {({ timeLeftStr }) => `Send follow up ${timeLeftStr}`}
          </Button>
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

    if (data.receivedContactRequest) {
      const {
        receivedContactRequest: { createdAt }
      } = data;

      return (
        <View
          style={{
            marginHorizontal: 15,
            marginTop: 50
          }}
        >
          <Text
            style={{
              textAlign: 'center',
              fontWeight: 'bold',
              marginBottom: 30
            }}
          >
            Sent you a contact request{' '}
            <TimeAgo dateFrom={createdAt} />
          </Text>
          <Button
            color={paperTheme.colors.primary}
            mode="contained"
            onPress={acceptContactRequest}
            disabled={isDisabled}
          >
            Accept
          </Button>
          <Button
            color={paperTheme.colors.error}
            mode="outlined"
            onPress={declineContactRequest}
            disabled={isDisabled}
            style={{ marginTop: 15 }}
          >
            Decline
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
    acceptContactRequest,
    blockUser,
    cancelContactRequest,
    data,
    declineContactRequest,
    error,
    fullName,
    isDisabled,
    isError,
    isRefreshing,
    sendFollowUp,
    sendRequest,
    unblockUser
  ]);

  return (
    <ScrollView>
      <View style={{ margin: 15, marginTop: 30 }}>
        <View
          style={{ alignItems: 'center', justifyContent: 'center' }}
        >
          <UserAvatar user={contactData} size={100} />
          <View style={{ marginTop: 15 }}>
            <Headline
              style={{ textAlign: 'center' }}
              numberOfLines={3}
            >
              {fullName}
            </Headline>
            <View style={{ alignItems: 'center' }}>
              {renderUserTitle(contactData, {
                style: { textAlign: 'center' },
                numberOfLines: 3
              })}
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
