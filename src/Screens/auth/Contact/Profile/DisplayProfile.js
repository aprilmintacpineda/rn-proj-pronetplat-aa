import { useNavigation } from '@react-navigation/core';
import { emitEvent } from 'fluxible-js';
import React from 'react';
import { ScrollView, View, RefreshControl } from 'react-native';
import { Headline, Text, Divider } from 'react-native-paper';
import ContactDetailRow from './Row';
import Caption from 'components/Caption';
import ContactDetailLoadingPlaceholder from 'components/ContactDetailLoadingPlaceholder';
import RefreshableView from 'components/RefreshableView';
import RNVectorIcon from 'components/RNVectorIcon';
import UnknownErrorView from 'components/UnknownErrorView';
import UserAvatar from 'components/UserAvatar';
import {
  showConfirmDialog,
  showRequestFailedPopup
} from 'fluxible/actions/popup';
import useDataFetch from 'hooks/useDataFetch';
import { logEvent } from 'libs/logging';
import {
  getFullName,
  renderUserTitle,
  getPersonalPronoun
} from 'libs/user';
import { xhr } from 'libs/xhr';

function ContactProfile ({ contact }) {
  const { user } = contact;
  const fullName = getFullName(user);
  const [isMenuDisabled, setMenuDisabled] = React.useState(false);
  const [isDisabled, setIsDisabled] = React.useState(false);
  const { setOptions, goBack, setParams } = useNavigation();

  const onFetchDone = React.useCallback(() => {
    setIsDisabled(false);
  }, []);

  const {
    isError,
    data,
    isRefreshing,
    isFetching,
    refreshData,
    isFirstFetch
  } = useDataFetch({
    endpoint: `/my-contact/${contact.id}`,
    onFetchDone
  });

  const confirmBlockUser = React.useCallback(async () => {
    try {
      setIsDisabled(true);

      await xhr(`/block-user/${user.id}`, {
        method: 'post'
      });

      emitEvent('refreshMyContactList');
      goBack();
    } catch (error) {
      console.log(error);
      showRequestFailedPopup();

      logEvent('confirmBlockUserError', {
        message: error.message
      });
    }
  }, [user.id, goBack]);

  const confirmRemoveFromContacts = React.useCallback(async () => {
    try {
      setIsDisabled(true);

      await xhr(`/remove-from-contacts/${user.id}`, {
        method: 'post'
      });

      emitEvent('refreshMyContactList');
      goBack();
    } catch (error) {
      console.log(error);
      showRequestFailedPopup();

      logEvent('confirmRemoveFromContactsError', {
        message: error.message
      });
    }
  }, [user.id, goBack]);

  const markAsCloseFriend = React.useCallback(async () => {
    try {
      setMenuDisabled(true);

      await xhr(`/mark-as-close-friend/${contact.id}`, {
        method: 'post'
      });

      emitEvent('refreshMyContactList');
      setMenuDisabled(false);

      setParams({
        ...contact,
        isCloseFriend: true
      });
    } catch (error) {
      console.log(error);
      showRequestFailedPopup();
      setMenuDisabled(false);

      logEvent('markAsCloseFriendError', {
        message: error.message
      });
    }
  }, [contact, setParams]);

  const unmarkAsCloseFriend = React.useCallback(async () => {
    try {
      setMenuDisabled(true);

      await xhr(`/unmark-as-close-friend/${contact.id}`, {
        method: 'post'
      });

      emitEvent('refreshMyContactList');
      setMenuDisabled(false);

      setParams({
        ...contact,
        isCloseFriend: false
      });
    } catch (error) {
      console.log(error);
      showRequestFailedPopup();
      setMenuDisabled(false);

      logEvent('markAsCloseFriendError', {
        message: error.message
      });
    }
  }, [contact, setParams]);

  React.useEffect(() => {
    if (isError || isFetching) return;

    const actions = [];

    if (contact.isCloseFriend) {
      actions.push({
        title: 'Un-close Friend',
        icon: props => (
          <RNVectorIcon
            provider="MaterialCommunityIcons"
            name="star-off"
            {...props}
          />
        ),
        onPress: unmarkAsCloseFriend,
        disabled: isDisabled || isMenuDisabled
      });
    } else {
      actions.push({
        title: 'Close Friend',
        icon: props => (
          <RNVectorIcon
            provider="MaterialCommunityIcons"
            name="star-outline"
            {...props}
          />
        ),
        onPress: markAsCloseFriend,
        disabled: isDisabled || isMenuDisabled
      });
    }

    actions.push(
      {
        title: 'Remove',
        icon: props => (
          <RNVectorIcon
            provider="MaterialCommunityIcons"
            name="qrcode-minus"
            {...props}
          />
        ),
        onPress: () => {
          showConfirmDialog({
            message: `Are you sure you want to remove ${fullName} from your contacts?`,
            onConfirm: confirmRemoveFromContacts,
            isDestructive: true
          });
        },
        disabled: isDisabled || isMenuDisabled
      },
      {
        title: 'Block',
        icon: props => (
          <RNVectorIcon
            provider="MaterialCommunityIcons"
            name="qrcode-remove"
            {...props}
          />
        ),
        onPress: () => {
          const personalPronoun = getPersonalPronoun(user);

          showConfirmDialog({
            message: `Are you sure you want to block ${fullName}? ${personalPronoun.subjective.ucfirst} will no longer be able to see your contact details and ${personalPronoun.subjective.lowercase} will be removed from your contacts.`,
            onConfirm: confirmBlockUser,
            isDestructive: true
          });
        },
        disabled: isDisabled || isMenuDisabled
      }
    );

    setOptions({
      title: fullName,
      actions
    });
  }, [
    confirmBlockUser,
    confirmRemoveFromContacts,
    contact,
    isDisabled,
    isMenuDisabled,
    fullName,
    isError,
    isFetching,
    markAsCloseFriend,
    unmarkAsCloseFriend,
    user,
    setOptions
  ]);

  const contactDetails = React.useMemo(() => {
    if (isError) {
      return (
        <UnknownErrorView
          isRefreshing={isRefreshing}
          onRefresh={refreshData}
        />
      );
    }

    if (!data || isFetching) {
      return (
        <ContactDetailLoadingPlaceholder
          isFirstFetch={isFirstFetch}
          isFetching={isFetching}
        />
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
    data,
    fullName,
    isDisabled,
    isError,
    isFetching,
    refreshData,
    isFirstFetch,
    isRefreshing
  ]);

  return (
    <ScrollView
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={refreshData}
        />
      }
    >
      <View style={{ margin: 15, marginTop: 30 }}>
        <View
          style={{ alignItems: 'center', justifyContent: 'center' }}
        >
          <UserAvatar user={user} size={100} />
          <View style={{ marginTop: 15 }}>
            <Headline
              style={{ textAlign: 'center' }}
              numberOfLines={3}
            >
              {fullName}
            </Headline>
            <View style={{ alignItems: 'center' }}>
              {renderUserTitle(user, {
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
          {user.bio}
        </Text>
      </View>
      {contactDetails}
    </ScrollView>
  );
}

export default React.memo(ContactProfile);
