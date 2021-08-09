import { emitEvent } from 'fluxible-js';
import React from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import Button from 'components/Button';
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
          canInvite: false
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

  const resolveIsSelected = React.useCallback(
    user => !user.canInvite,
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
        mode="contained"
        style={{ marginVertical: 10 }}
        onPress={openModal}
      >
        Invite your contacts
      </Button>
      <FullScreenModal isVisible={isVisible}>
        <SelectContacts
          onClose={closeModal}
          onSelect={inviteUser}
          url={`/events/invite-contacts/${event.id}`}
          resolveIsSelected={resolveIsSelected}
          resolveIsLoading={resolveIsLoading}
          eventListeners={eventListeners}
        />
      </FullScreenModal>
    </>
  );
}

export default React.memo(InviteContacts);
