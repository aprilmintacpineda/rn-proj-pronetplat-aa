import React from 'react';
import Details from './Details';
import Organizers from './Organizers';
import Tabs from 'components/Tabs';
import Tab from 'components/Tabs/Tab';

function EditEvent () {
  return (
    <Tabs>
      <Tab label="Details">
        <Details />
      </Tab>
      <Tab label="Organizers">
        <Organizers />
      </Tab>
    </Tabs>
  );
}

export default React.memo(EditEvent);
