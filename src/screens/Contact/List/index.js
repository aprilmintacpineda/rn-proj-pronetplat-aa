import React from 'react';
import { FlatList } from 'react-native';

import ListItemSeparator from 'components/ListItemSeparator';

import ContactListEmpty from './Empty';
import ContactListRow from './Row';
import useDataFetch from 'hooks/useDataFetch';

function keyExtractor ({ id }) {
  return id;
}

function renderItem ({ item }) {
  return <ContactListRow {...item} />;
}

const loadingData = [
  {
    id: '1',
    isLoading: true
  },
  {
    id: '2',
    isLoading: true
  },
  {
    id: '3',
    isLoading: true
  }
];

function ContactList () {
  const { data, isFirstFetch, refreshData, isRefreshing } = useDataFetch({
    endpoint: '/contacts'
  });

  if (isFirstFetch) {
    return (
      <FlatList
        ItemSeparatorComponent={ListItemSeparator}
        data={loadingData}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
      />
    );
  }

  return (
    <FlatList
      onRefresh={refreshData}
      refreshing={isRefreshing}
      ListEmptyComponent={ContactListEmpty}
      ItemSeparatorComponent={ListItemSeparator}
      data={data}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
    />
  );
}

export default React.memo(ContactList);
