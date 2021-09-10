import { emitEvent } from 'fluxible-js';
import React from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import { navigationRef } from 'App';
import Button from 'components/Button';
import Caption from 'components/Caption';
import FullScreenModal from 'components/FullScreenModal';
import SelectContacts from 'components/SelectContacts';
import { unknownErrorPopup } from 'fluxible/actions/popup';
import { xhr } from 'libs/xhr';
import { paperTheme } from 'theme';

const eventListeners = {
  invitedUserToEvent: (userId, { replaceData }) => {
    replaceData(data =>
      data.map(contact => {
        if (contact.id !== userId) return contact;

        return {
          ...contact,
          hasInvitation: true
        };
      })
    );
  },
  'websocketEvent-eventInvitationRejected': (
    { sender, payload: { event } },
    { replaceData }
  ) => {
    const currentRoute = navigationRef.current.getCurrentRoute();
    if (currentRoute.params.id !== event.id) return;

    replaceData(data =>
      data.map(contact => {
        if (contact.id !== sender.id) return contact;

        return {
          ...contact,
          hasInvitation: false
        };
      })
    );
  },
  'websocketEvent-eventInvitationAccepted': (
    { sender, payload: { event } },
    { replaceData }
  ) => {
    const currentRoute = navigationRef.current.getCurrentRoute();
    if (currentRoute.params.id !== event.id) return;

    replaceData(data =>
      data.map(contact => {
        if (contact.id !== sender.id) return contact;

        return {
          ...contact,
          hasInvitation: false,
          isGoing: true
        };
      })
    );
  }
};

function InviteContacts ({ event }) {
  const [isVisible, setIsVisible] = React.useState(false);
  const [invitingUsersList, setInvitingUsersList] = React.useState(
    []
  );
  const { maxAttendees, numGoing } = event;

  const openModal = React.useCallback(() => {
    setIsVisible(true);
  }, []);

  const closeModal = React.useCallback(() => {
    setIsVisible(false);
  }, []);

  const renderSelectedWidget = React.useCallback(user => {
    let label = null;

    if (user.isGoing) label = 'Attending';
    if (user.isOrganizer) label = 'Organizer';
    if (user.hasInvitation) label = 'Invited';

    if (label) {
      return (
        <Caption
          color={paperTheme.colors.primary}
          style={{
            borderWidth: 1,
            borderColor: paperTheme.colors.primary,
            padding: 5,
            borderRadius: paperTheme.roundness
          }}
        >
          {label}
        </Caption>
      );
    }

    return null;
  }, []);

  const resolveIsSelected = React.useCallback(
    user => user.hasInvitation || user.isGoing || user.isOrganizer,
    []
  );

  const resolveIsLoading = React.useCallback(
    user => {
      return Boolean(
        invitingUsersList.find(({ id }) => user.id === id)
      );
    },
    [invitingUsersList]
  );

  const inviteUser = React.useCallback(
    async user => {
      try {
        setInvitingUsersList(oldList => oldList.concat(user));

        await xhr(`/events/invite-user/${event.id}`, {
          method: 'post',
          body: {
            contactId: user.id
          }
        });

        emitEvent('invitedUserToEvent', user.id);
      } catch (error) {
        console.log(error);
        unknownErrorPopup();
      } finally {
        setInvitingUsersList(oldList =>
          oldList.filter(({ id }) => id !== user.id)
        );
      }
    },
    [event]
  );

  if (numGoing >= maxAttendees) {
    return (
      <View style={{ marginTop: 10 }}>
        <Text style={{ color: paperTheme.colors.error }}>
          Event is full.
        </Text>
      </View>
    );
  }

  return (
    <>
      <Button
        mode={
          event.isGoing || event.isOrganizer
            ? 'contained'
            : 'outlined'
        }
        onPress={openModal}
      >
        Invite your contacts
      </Button>
      <FullScreenModal isVisible={isVisible}>
        <SelectContacts
          onClose={closeModal}
          onSelect={inviteUser}
          url={`/events/invite-contacts/${event.id}`}
          renderSelectedWidget={renderSelectedWidget}
          resolveIsSelected={resolveIsSelected}
          resolveIsLoading={resolveIsLoading}
          eventListeners={eventListeners}
        />
      </FullScreenModal>
    </>
  );
}

export default React.memo(InviteContacts);
