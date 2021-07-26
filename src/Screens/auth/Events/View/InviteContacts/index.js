import { emitEvent } from 'fluxible-js';
import React from 'react';
import Button from 'components/Button';
import FullScreenModal from 'components/FullScreenModal';
import SelectContacts from 'components/SelectContacts';

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

  console.log(event);

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

  const inviteUser = React.useCallback(async user => {
    console.log('inviteUser', user);
    setInvitingUsersList(oldList => oldList.concat(user));
    emitEvent('invitedUserToEvent', user.id);
  }, []);

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
