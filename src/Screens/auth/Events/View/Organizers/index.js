import { useRoute } from '@react-navigation/core';
import React from 'react';
import Row from './Row';
import ContactsLoadingPlaceholder from 'components/ContactsLoadingPlaceholder';
import DataFlatList from 'components/DataFlatList';

function Organizers () {
  const { params: event } = useRoute();

  return (
    <DataFlatList
      LoadingPlaceHolder={ContactsLoadingPlaceholder}
      endpoint={`/event/organizers/${event.id}`}
      RowComponent={Row}
    />
  );
}

export default React.memo(Organizers);
