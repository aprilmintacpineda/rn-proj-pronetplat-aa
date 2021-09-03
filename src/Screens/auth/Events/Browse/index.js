import React from 'react';
import { Appbar } from 'react-native-paper';
import FilterForm from './FilterForm';
import Row from './Row';
import DataFlatList from 'components/DataFlatList';
import Modalize from 'components/Modalize';
import RNVectorIcon from 'components/RNVectorIcon';
import Tabs from 'components/Tabs';
import Tab from 'components/Tabs/Tab';
import useState from 'hooks/useState';
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

function filtersIcon (props) {
  return (
    <RNVectorIcon
      provider="Ionicons"
      name="ios-filter-outline"
      {...props}
    />
  );
}

function BrowseEvents ({ navigation: { setOptions } }) {
  const modalizeRef = React.useRef();
  const { status, coordinates } = useUserLocation();
  const { state, updateState } = useState({
    search: '',
    unit: 'kilometers',
    maxDistance: 100
  });

  const { maxDistance, unit, search } = state;

  React.useEffect(() => {
    setOptions({
      button: (
        <Appbar.Action
          color="#fff"
          icon={filtersIcon}
          onPress={() => {
            modalizeRef.current.open();
          }}
        />
      )
    });
  }, [setOptions]);

  const onApplyFilters = React.useCallback(
    filters => {
      updateState(filters);
      modalizeRef.current.close();
    },
    [updateState]
  );

  if (status === 'initial') return null;

  return (
    <>
      <Tabs>
        <Tab label="Past events">
          <DataFlatList
            endpoint="/browse-events"
            RowComponent={Row}
            params={{
              schedule: 'past',
              lat: coordinates.lat,
              lng: coordinates.lng,
              unit,
              maxDistance,
              search
            }}
            listEmptyMessage="There are no past events."
            otherRowProps={{
              unit,
              maxDistance,
              search
            }}
          />
        </Tab>
        <Tab label="On-going">
          <DataFlatList
            endpoint="/browse-events"
            RowComponent={Row}
            params={{
              schedule: 'present',
              lat: coordinates.lat,
              lng: coordinates.lng,
              unit,
              maxDistance,
              search
            }}
            listEmptyMessage="There are no on-going events."
            otherRowProps={state}
          />
        </Tab>
        <Tab label="Future events">
          <DataFlatList
            endpoint="/browse-events"
            RowComponent={Row}
            params={{
              schedule: 'future',
              lat: coordinates.lat,
              lng: coordinates.lng,
              unit,
              maxDistance,
              search
            }}
            listEmptyMessage="There are no future events"
            eventListeners={eventListeners}
            otherRowProps={state}
          />
        </Tab>
      </Tabs>
      <Modalize ref={modalizeRef}>
        <FilterForm onSave={onApplyFilters} {...state} />
      </Modalize>
    </>
  );
}

export default React.memo(BrowseEvents);
