import { useRoute } from '@react-navigation/native';
import React from 'react';
import Row from './Row';
import ContactsLoadingPlaceholder from 'components/ContactsLoadingPlaceholder';
import DataFlatList from 'components/DataFlatList';

const eventListeners = {};

function EditEventOrganizers () {
  const { params: event } = useRoute();

  return (
    <DataFlatList
      LoadingPlaceHolder={ContactsLoadingPlaceholder}
      endpoint={`/event/organizers/${event.id}`}
      eventListeners={eventListeners}
      RowComponent={Row}
    />
  );
}

export default React.memo(EditEventOrganizers);
