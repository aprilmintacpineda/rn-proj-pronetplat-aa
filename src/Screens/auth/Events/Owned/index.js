import React from 'react';
import Row from './Row';
import DataFlatList from 'components/DataFlatList';
import RNVectorIcon from 'components/RNVectorIcon';
import Tabs from 'components/Tabs';
import Tab from 'components/Tabs/Tab';

const eventListeners = {
  changedEventCoverPicture: (
    { id, coverPicture },
    { replaceData }
  ) => {
    replaceData(data =>
      data.map(event => {
        if (event.id !== id) return event;

        return {
          ...event,
          coverPicture
        };
      })
    );
  },
  publishedEvent: (id, { replaceData }) => {
    replaceData(data =>
      data.map(event => {
        if (event.id !== id) return event;

        return {
          ...event,
          status: 'published'
        };
      })
    );
  },
  eventCreated: (_, { refreshData }) => {
    refreshData();
  },
  editedEventData: (updatedEventData, { replaceData }) => {
    replaceData(data =>
      data.map(event => {
        if (event.id !== updatedEventData.id) return event;

        return {
          ...event,
          ...updatedEventData
        };
      })
    );
  },
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

const pastParams = { schedule: 'past' };
const presentParams = { schedule: 'present' };
const futureParams = { schedule: 'future' };

function OwnedEvents ({ navigation: { setOptions, navigate } }) {
  React.useEffect(() => {
    setOptions({
      actions: [
        {
          title: 'Create event',
          icon: props => (
            <RNVectorIcon
              provider="MaterialCommunityIcons"
              name="calendar-plus"
              {...props}
            />
          ),
          onPress: () => {
            navigate('CreateEvent');
          }
        }
      ]
    });
  }, [setOptions, navigate]);

  return (
    <Tabs>
      <Tab label="Past">
        <DataFlatList
          endpoint="/my-events"
          RowComponent={Row}
          params={pastParams}
          listEmptyMessage="You have no past events."
        />
      </Tab>
      <Tab label="On-going">
        <DataFlatList
          endpoint="/my-events"
          RowComponent={Row}
          params={presentParams}
          listEmptyMessage="You have no on-going events."
        />
      </Tab>
      <Tab label="Upcoming">
        <DataFlatList
          endpoint="/my-events"
          RowComponent={Row}
          params={futureParams}
          listEmptyMessage="You have no future events"
          eventListeners={eventListeners}
        />
      </Tab>
    </Tabs>
  );
}

export default React.memo(OwnedEvents);
