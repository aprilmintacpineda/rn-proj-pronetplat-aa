import React from 'react';
import RegularUserList from 'components/RegularUserList';

const eventListeners = {
  userBlocked: (contactId, { filterData }) => {
    filterData(data => data.id !== contactId);
  }
};

function ContactList () {
  return (
    <RegularUserList
      endpoint="/my-contacts"
      eventListeners={eventListeners}
    />
  );
}

export default React.memo(ContactList);
