import { useRoute } from '@react-navigation/native';
import React from 'react';
import AddOrganizer from './AddOrganizer';
import Row from './Row';
import ContactsLoadingPlaceholder from 'components/ContactsLoadingPlaceholder';
import DataFlatList from 'components/DataFlatList';

function EditEventOrganizers () {
  const { params: event } = useRoute();

  return (
    <DataFlatList
      LoadingPlaceHolder={ContactsLoadingPlaceholder}
      endpoint={`/event/organizers/${event.id}`}
      RowComponent={Row}
    >
      <AddOrganizer />
    </DataFlatList>
  );
}

export default React.memo(EditEventOrganizers);
