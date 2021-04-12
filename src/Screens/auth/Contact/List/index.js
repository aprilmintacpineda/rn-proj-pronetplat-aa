import { updateStore } from 'fluxible-js';
import React from 'react';
import RefreshController from './RefreshController';
import RegularUserList from 'components/RegularUserList';

const eventListeners = {
  refreshMyContactList: () => {
    updateStore({ refreshMyContactList: true });
  }
};

function ContactList () {
  return (
    <RegularUserList
      endpoint="/my-contacts"
      eventListeners={eventListeners}
    >
      <RefreshController />
    </RegularUserList>
  );
}

export default React.memo(ContactList);
