import React from 'react';
import RegularUserList from 'components/RegularUserList';

const events = {
  userUnblocked: (contactId, { filterData }) => {
    filterData(data => data.id !== contactId);
  }
};

function BlockList () {
  return <RegularUserList endpoint="/block-list" events={events} />;
}

export default React.memo(BlockList);
