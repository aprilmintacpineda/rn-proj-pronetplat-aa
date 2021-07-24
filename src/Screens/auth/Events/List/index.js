import React from 'react';
import Row from './Row';
import DataFlatList from 'components/DataFlatList';
import RNVectorIcon from 'components/RNVectorIcon';

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
  }
};

function EventsList ({ navigation: { setOptions, navigate } }) {
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
    <DataFlatList
      endpoint="/my-events"
      RowComponent={Row}
      listEmptyMessage="You don't have any events request yet. Create or join an event to get started."
      eventListeners={eventListeners}
    />
  );
}

export default React.memo(EventsList);
