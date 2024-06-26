import React from 'react';
import Discussion from './Discussion';
import Info from './Info';
import Organizers from './Organizers';
import Tabs from 'components/Tabs';
import Tab from 'components/Tabs/Tab';

function ViewEvent ({ route: { params: event } }) {
  if (event.status === 'published') {
    return (
      <Tabs>
        <Tab label="Info">
          <Info />
        </Tab>
        <Tab label="Discussion">
          <Discussion />
        </Tab>
        <Tab label="Organizers">
          <Organizers />
        </Tab>
      </Tabs>
    );
  }

  return <Info />;
}

export default React.memo(ViewEvent);
