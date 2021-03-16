import React from 'react';
import RegularUserList from 'components/RegularUserList';

const eventListeners = {
  userUnblocked: (contactId, { filterData }) => {
    filterData(data => data.id !== contactId);
  }
};

function BlockList () {
  return (
    <RegularUserList
      endpoint="/block-list"
      eventListeners={eventListeners}
    />
  );
}

export default React.memo(BlockList);
