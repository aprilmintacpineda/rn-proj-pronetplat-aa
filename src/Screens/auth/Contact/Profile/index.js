import { emitEvent } from 'fluxible-js';
import React from 'react';
import { ScrollView, View, Alert } from 'react-native';
import { Headline, Text, Divider } from 'react-native-paper';
import ContactDetailRow from './Row';
import Button from 'components/Button';
import Caption from 'components/Caption';
import ContactDetailLoadingPlaceholder from 'components/ContactDetailLoadingPlaceholder';
import RefreshableView from 'components/RefreshableView';
import RNVectorIcon from 'components/RNVectorIcon';
import TimeAgo from 'components/TimeAgo';
import UnknownErrorView from 'components/UnknownErrorView';
import UserAvatar from 'components/UserAvatar';
import { showRequestFailedPopup } from 'fluxible/actions/popup';
import { decrementContactRequestsCount } from 'fluxible/actions/user';
import useDataFetch from 'hooks/useDataFetch';
import { logEvent } from 'libs/logging';
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

  const onSuccess = React.useCallback(() => {
    setIsDisabled(false);
  }, []);

  const {
    isError,
    error,
    data,
    isRefreshing,
    isFetching,
    refreshData,
    isFirstFetch
  } = useDataFetch({
    endpoint: `/contacts/${contactData.id}`,
    onSuccess
  });

  const confirmUnblockUser = React.useCallback(async () => {
    try {
      setIsDisabled(true);

      await xhr(`/unblock-user/${contactData.id}`, {
        method: 'post'
      });

      emitEvent('userUnblocked', contactData.id);
    } catch (error) {
      console.log(error);
      showRequestFailedPopup();

      logEvent('confirmUnblockUserError', {
        message: error.message
      });
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

      await xhr(`/block-user/${contactData.id}`, {
        method: 'post'
      });

      emitEvent('userBlocked', contactData.id);
    } catch (error) {
      console.log(error);
      showRequestFailedPopup();

      logEvent('confirmBlockUserError', {
        message: error.message
      });
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
      await xhr(`/send-follow-up/${contactData.id}`, {
        method: 'post'
      });
    } catch (error) {
      console.log(error);
      showRequestFailedPopup();

      logEvent('sendFollowUpError', {
        message: error.message
      });
    } finally {
      refreshData();
    }
  }, [refreshData, contactData.id]);

  const sendRequest = React.useCallback(async () => {
    try {
      setIsDisabled(true);

      await xhr(`/add-to-contacts/${contactData.id}`, {
        method: 'post'
      });
    } catch (error) {
      console.log(error);
      showRequestFailedPopup();

      logEvent('sendRequestError', {
        message: error.message
      });
    } finally {
      refreshData();
    }
    setIsDisabled(true);
  }, [contactData, refreshData]);

  const confirmCancelContactRequest = React.useCallback(async () => {
    try {
      setIsDisabled(true);
      await xhr(`/cancel-contact-request/${contactData.id}`, {
        method: 'post'
      });
    } catch (error) {
      console.log('error', error);
      showRequestFailedPopup();

      logEvent('confirmCancelContactRequestError', {
        message: error.message
      });
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

      await xhr(`/accept-contact-request/${contactData.id}`, {
        method: 'post'
      });

      decrementContactRequestsCount();
      emitEvent('respondedToContactRequest', contactData.id);
    } catch (error) {
      console.log(error);
      showRequestFailedPopup();

      logEvent('acceptContactRequestError', {
        message: error.message
      });
    } finally {
      refreshData();
    }
  }, [contactData.id, refreshData]);

  const declineContactRequest = React.useCallback(async () => {
    try {
      setIsDisabled(true);

      await xhr(`/decline-contact-request/${contactData.id}`, {
        method: 'post'
      });

      decrementContactRequestsCount();
      emitEvent('respondedToContactRequest', contactData.id);
    } catch (error) {
      console.log(error);
      showRequestFailedPopup();

      logEvent('declineContactRequestError', {
        message: error.message
      });
    } finally {
      refreshData();
    }
  }, [contactData.id, refreshData]);

  const confirmRemoveFromContacts = React.useCallback(async () => {
    try {
      setIsDisabled(true);

      await xhr(`/remove-from-contacts/${contactData.id}`, {
        method: 'post'
      });
    } catch (error) {
      console.log(error);
      showRequestFailedPopup();

      logEvent('confirmRemoveFromContactsError', {
        message: error.message
      });
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
              provider="MaterialCommunityIcons"
              name="qrcode-minus"
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
              provider="MaterialCommunityIcons"
              name="qrcode-remove"
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

      return (
        <UnknownErrorView
          isRefreshing={isRefreshing}
          onRefresh={refreshData}
        />
      );
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
        <ContactDetailLoadingPlaceholder
          isFirstFetch={isFirstFetch}
          isFetching={isFetching}
        />
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
      },
      website: {
        data: [],
        labels: {
          plural: 'Website',
          singular: 'Websites'
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

    const len = groupedData.length;

    if (!len) {
      return (
        <RefreshableView
          onRefresh={refreshData}
          isRefreshing={isRefreshing}
        >
          {fullName} does not have any contact information.
        </RefreshableView>
      );
    }

    const groupLastIndex = len - 1;

    return (
      <View style={{ margin: 15 }}>
        {groupedData.map(({ label, data }, index) => {
          if (!data.length) return null;

          return (
            <View key={label} style={{ marginBottom: 15 }}>
              <View style={{ marginBottom: 10 }}>
                <Caption>{label}</Caption>
              </View>
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
    unblockUser,
    isFetching,
    isFirstFetch,
    refreshData
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
                textAlign: 'center',
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
