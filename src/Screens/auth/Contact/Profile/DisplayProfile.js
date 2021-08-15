import { useNavigation } from '@react-navigation/core';
import { addEvent, addEvents, emitEvent } from 'fluxible-js';
import React from 'react';
import { ScrollView, View, RefreshControl } from 'react-native';
import { Headline, Text, Divider, Title } from 'react-native-paper';
import ContactDetailRow from './Row';
import Button from 'components/Button';
import Caption from 'components/Caption';
import ContactDetailLoadingPlaceholder from 'components/ContactDetailLoadingPlaceholder';
import RNVectorIcon from 'components/RNVectorIcon';
import TimeAgo from 'components/TimeAgo';
import UnknownErrorView from 'components/UnknownErrorView';
import UserAvatar from 'components/UserAvatar';
import {
  showRequestFailedPopup,
  showConfirmDialog,
  showSuccessPopup
} from 'fluxible/actions/popup';
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

function ContactProfile ({ contact }) {
  const fullName = getFullName(contact);
  const [isDisabled, setIsDisabled] = React.useState(false);
  const { setOptions } = useNavigation();

  const onFetchDone = React.useCallback(() => {
    setIsDisabled(false);
  }, []);

  const {
    isError,
    error,
    data,
    isRefreshing,
    isFetching,
    refreshData,
    isFirstFetch,
    replaceData
  } = useDataFetch({
    endpoint: `/contacts/${contact.id}`,
    onFetchDone
  });

  React.useEffect(() => {
    const removeListeners = [
      addEvent(
        'websocketEvent-notification',
        ({ trigger, user }) => {
          if (
            user.id === contact.id &&
            (trigger === 'contactRequest' ||
              trigger === 'contactRequestAccepted' ||
              trigger === 'contactRequestCancelled' ||
              trigger === 'contactRequestDeclined')
          )
            refreshData();
        }
      ),
      addEvents(
        [
          'websocketEvent-blockedByUser',
          'websocketEvent-unblockedByUser',
          'websocketEvent-userDisconected'
        ],
        ({ user }) => {
          if (user.id === contact.id) refreshData();
        }
      )
    ];

    return () => {
      removeListeners.forEach(removeListener => {
        removeListener();
      });
    };
  }, [refreshData, contact]);

  const confirmUnblockUser = React.useCallback(async () => {
    try {
      setIsDisabled(true);

      await xhr(`/unblock-user/${contact.id}`, {
        method: 'post'
      });

      emitEvent('userUnblocked', contact.id);
    } catch (error) {
      console.log(error);
      showRequestFailedPopup();

      logEvent('confirmUnblockUserError', {
        message: error.message
      });
    } finally {
      refreshData();
    }
  }, [contact.id, refreshData]);

  const unblockUser = React.useCallback(() => {
    const personalPronoun = getPersonalPronoun(contact);

    showConfirmDialog({
      message: `Are you sure you want to unblock ${fullName}? ${personalPronoun.subjective.ucfirst} will be able to send you a contact request again.`,
      onConfirm: confirmUnblockUser,
      isDestructive: true
    });
  }, [fullName, contact, confirmUnblockUser]);

  const confirmBlockUser = React.useCallback(async () => {
    try {
      setIsDisabled(true);

      await xhr(`/block-user/${contact.id}`, {
        method: 'post'
      });

      emitEvent('refreshContactList');
    } catch (error) {
      console.log(error);
      showRequestFailedPopup();

      logEvent('confirmBlockUserError', {
        message: error.message
      });
    } finally {
      refreshData();
    }
  }, [contact.id, refreshData]);

  const blockUser = React.useCallback(() => {
    const personalPronoun = getPersonalPronoun(contact);

    showConfirmDialog({
      message: `Are you sure you want to block ${fullName}? ${personalPronoun.subjective.ucfirst} will no longer be able to see your contact details and ${personalPronoun.subjective.lowercase} will be removed from your contacts.`,
      onConfirm: confirmBlockUser,
      isDestructive: true
    });
  }, [confirmBlockUser, fullName, contact]);

  const sendFollowUp = React.useCallback(async () => {
    try {
      setIsDisabled(true);

      const response = await xhr(`/send-follow-up/${contact.id}`, {
        method: 'post'
      });

      showSuccessPopup({
        message: `A follow up has been sent to ${fullName}.`
      });

      const newData = await response.json();

      replaceData({
        ...data,
        sentContactRequest: {
          ...data.sentContactRequest,
          canFollowUpAt: newData.canFollowUpAt
        }
      });

      setIsDisabled(false);
    } catch (error) {
      console.log(error);
      showRequestFailedPopup();

      logEvent('sendFollowUpError', {
        message: error.message
      });
    }
  }, [replaceData, data, contact.id, fullName]);

  const sendRequest = React.useCallback(async () => {
    try {
      setIsDisabled(true);

      await xhr(`/add-to-contacts/${contact.id}`, {
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
  }, [contact, refreshData]);

  const confirmCancelContactRequest = React.useCallback(async () => {
    try {
      setIsDisabled(true);
      await xhr(`/cancel-contact-request/${contact.id}`, {
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
  }, [refreshData, contact.id]);

  const cancelContactRequest = React.useCallback(() => {
    showConfirmDialog({
      message: `Are you sure you want to cancel your contact request to ${fullName}?`,
      onConfirm: confirmCancelContactRequest,
      isDestructive: true
    });
  }, [fullName, confirmCancelContactRequest]);

  const acceptContactRequest = React.useCallback(async () => {
    try {
      setIsDisabled(true);

      await xhr(`/accept-contact-request/${contact.id}`, {
        method: 'post'
      });

      decrementContactRequestsCount();
      emitEvent('respondedToContactRequest', contact.id);
      emitEvent('refreshContactList');
    } catch (error) {
      console.log(error);
      showRequestFailedPopup();

      logEvent('acceptContactRequestError', {
        message: error.message
      });
    } finally {
      refreshData();
    }
  }, [contact.id, refreshData]);

  const declineContactRequest = React.useCallback(async () => {
    try {
      setIsDisabled(true);

      await xhr(`/decline-contact-request/${contact.id}`, {
        method: 'post'
      });

      decrementContactRequestsCount();
      emitEvent('respondedToContactRequest', contact.id);
      emitEvent('refreshContactList');
    } catch (error) {
      console.log(error);
      showRequestFailedPopup();

      logEvent('declineContactRequestError', {
        message: error.message
      });
    } finally {
      refreshData();
    }
  }, [contact.id, refreshData]);

  const confirmDisconnect = React.useCallback(async () => {
    try {
      setIsDisabled(true);

      await xhr(`/disconnect/${contact.id}`, {
        method: 'post'
      });

      emitEvent('refreshContactList');
    } catch (error) {
      console.log(error);
      showRequestFailedPopup();

      logEvent('confirmDisconnectError', {
        message: error.message
      });
    } finally {
      refreshData();
    }
  }, [contact.id, refreshData]);

  const markAsCloseFriend = React.useCallback(async () => {
    try {
      setIsDisabled(true);

      await xhr(`/mark-as-close-friend/${contact.id}`, {
        method: 'post'
      });

      replaceData({
        ...data,
        isCloseFriend: true
      });

      emitEvent('refreshContactList');
    } catch (error) {
      console.log(error);
      showRequestFailedPopup();

      logEvent('markAsCloseFriendError', {
        message: error.message
      });
    } finally {
      setIsDisabled(false);
    }
  }, [contact.id, data, replaceData]);

  const unmarkAsCloseFriend = React.useCallback(async () => {
    try {
      setIsDisabled(true);

      await xhr(`/unmark-as-close-friend/${contact.id}`, {
        method: 'post'
      });

      replaceData({
        ...data,
        isCloseFriend: false
      });

      emitEvent('refreshContactList');
    } catch (error) {
      console.log(error);
      showRequestFailedPopup();

      logEvent('unmarkAsCloseFriendError', {
        message: error.message
      });
    } finally {
      setIsDisabled(false);
    }
  }, [contact.id, replaceData, data]);

  React.useEffect(() => {
    const actions = [];

    if (
      !isError &&
      !isFirstFetch &&
      !isRefreshing &&
      data &&
      !data.sentContactRequest &&
      !data.receivedContactRequest &&
      !data.blockedByUser &&
      !data.contactBlocked
    ) {
      actions.push(
        {
          title: !data.isCloseFriend
            ? 'Mark as close friend'
            : 'Unmark as close friend',
          icon: props => (
            <RNVectorIcon
              provider="MaterialCommunityIcons"
              name={data.isCloseFriend ? 'star' : 'star-outline'}
              {...props}
            />
          ),
          onPress: data.isCloseFriend
            ? unmarkAsCloseFriend
            : markAsCloseFriend,
          disabled: isDisabled
        },
        {
          title: 'Disconnect',
          icon: props => (
            <RNVectorIcon
              provider="Ionicons"
              name="ios-person-remove-outline"
              {...props}
            />
          ),
          onPress: () => {
            showConfirmDialog({
              message: `Are you sure you disconnect with ${fullName}? You won't be able to see each others contact details anymore.`,
              onConfirm: confirmDisconnect,
              isDestructive: true
            });
          },
          disabled: isDisabled
        },
        {
          title: 'Block',
          icon: props => (
            <RNVectorIcon
              provider="MaterialCommunityIcons"
              name="block-helper"
              {...props}
            />
          ),
          onPress: blockUser,
          disabled: isDisabled
        }
      );
    }

    setOptions({ actions });
  }, [
    isDisabled,
    fullName,
    confirmDisconnect,
    setOptions,
    confirmBlockUser,
    blockUser,
    data,
    isError,
    isFirstFetch,
    isRefreshing,
    markAsCloseFriend,
    unmarkAsCloseFriend
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
              mode="outlined"
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
          isFirstFetch={isFirstFetch || isRefreshing}
          isFetching={isFetching || isRefreshing}
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
          <Button
            color={paperTheme.colors.error}
            onPress={blockUser}
            disabled={isDisabled}
            style={{ marginTop: 15 }}
          >
            Block
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
            marginTop: 50,
            marginBottom: 10
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
            mode="outlined"
            onPress={declineContactRequest}
            disabled={isDisabled}
            style={{ marginTop: 15 }}
          >
            Decline
          </Button>
          <Button
            color={paperTheme.colors.error}
            onPress={blockUser}
            disabled={isDisabled}
            style={{ marginTop: 15 }}
          >
            Block
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

    data.contactDetails.forEach(contactDetail => {
      const { type } = contactDetail;

      types[type].data.push(
        <ContactDetailRow
          key={contactDetail.id}
          disabled={isDisabled}
          {...contactDetail}
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
        <View style={{ margin: 15 }}>
          <Button
            style={{ marginBottom: 30 }}
            mode="contained"
            to="ContactChat"
            params={contact}
            disabled={isDisabled}
          >
            Chat
          </Button>
          <Title style={{ textAlign: 'center', marginBottom: 15 }}>
            {fullName} does not have any contact information.
          </Title>
        </View>
      );
    }

    const groupLastIndex = len - 1;

    return (
      <View style={{ margin: 15 }}>
        <Button
          style={{ marginBottom: 30 }}
          mode="contained"
          to="ContactChat"
          params={contact}
          disabled={isDisabled}
        >
          Chat
        </Button>
        <View>
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
    refreshData,
    contact
  ]);

  return (
    <ScrollView
      refreshControl={
        !isDisabled && (
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={refreshData}
          />
        )
      }
    >
      <View style={{ margin: 15, marginTop: 30 }}>
        <View
          style={{ alignItems: 'center', justifyContent: 'center' }}
        >
          <UserAvatar user={contact} size={100} />
          <View style={{ marginTop: 15 }}>
            <Headline
              style={{ textAlign: 'center' }}
              numberOfLines={3}
            >
              {fullName}
            </Headline>
            <View style={{ alignItems: 'center' }}>
              {renderUserTitle(contact, {
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
          {contact.bio}
        </Text>
      </View>
      {contactDetails}
    </ScrollView>
  );
}

export default React.memo(ContactProfile);
