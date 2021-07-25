import { useRoute } from '@react-navigation/native';
import React from 'react';
import AddOrganizer from './AddOrganizer';
import Row from './Row';
import ContactsLoadingPlaceholder from 'components/ContactsLoadingPlaceholder';
import DataFlatList from 'components/DataFlatList';

const eventListeners = {
  organizerRemoved: (userId, { replaceData }) => {
    replaceData(data => data.filter(user => user.id !== userId));
  }
};

function EditEventOrganizers () {
  const { params: event } = useRoute();

  return (
    <DataFlatList
      LoadingPlaceHolder={ContactsLoadingPlaceholder}
      endpoint={`/event/organizers/${event.id}`}
      RowComponent={Row}
      eventListeners={eventListeners}
    >
      <AddOrganizer />
    </DataFlatList>
  );
}

export default React.memo(EditEventOrganizers);
