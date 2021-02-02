import React from 'react';
import RegularUserList from 'components/RegularUserList';

const events = {
  userBlocked: ({ contactId }, { filterData }) => {
    filterData(data => data.id !== contactId);
  }
};

function ContactList () {
  return <RegularUserList endpoint="/my-contacts" events={events} />;
}

export default React.memo(ContactList);
