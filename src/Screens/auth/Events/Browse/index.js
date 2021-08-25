import React from 'react';
import Row from './Row';
import DataFlatList from 'components/DataFlatList';
import DefaultLoadingPlaceholder from 'components/DefaultLoadingPlaceholder';
import Tabs from 'components/Tabs';
import Tab from 'components/Tabs/Tab';
import useUserLocation from 'hooks/useUserLocation';

const eventListeners = {
  cancelledGoing: (id, { replaceData }) => {
    replaceData(data => data.filter(event => event.id !== id));
  },
  joinedEvent: (id, { replaceData }) => {
    replaceData(data =>
      data.map(event => {
        if (event.id !== id) return event;

        return {
          ...event,
          isGoing: true
        };
      })
    );
  }
};

function BrowseEvents () {
  const { status, currentPosition } = useUserLocation();

  if (
    (status === 'granted' || status === 'denied') &&
    currentPosition.status !== 'initial'
  ) {
    return (
      <Tabs>
        <Tab label="Past events">
          <DataFlatList
            endpoint="/browse-events"
            RowComponent={Row}
            params={{
              schedule: 'past',
              lat: currentPosition.coordinates.lat,
              lng: currentPosition.coordinates.lng
            }}
            listEmptyMessage="There are no past events."
          />
        </Tab>
        <Tab label="On-going">
          <DataFlatList
            endpoint="/browse-events"
            RowComponent={Row}
            params={{
              schedule: 'present',
              lat: currentPosition.coordinates.lat,
              lng: currentPosition.coordinates.lng
            }}
            listEmptyMessage="There are no on-going events."
          />
        </Tab>
        <Tab label="Future events">
          <DataFlatList
            endpoint="/browse-events"
            RowComponent={Row}
            params={{
              schedule: 'future',
              lat: currentPosition.coordinates.lat,
              lng: currentPosition.coordinates.lng
            }}
            listEmptyMessage="There are no future events"
            eventListeners={eventListeners}
          />
        </Tab>
      </Tabs>
    );
  }

  return <DefaultLoadingPlaceholder />;
}

export default React.memo(BrowseEvents);
