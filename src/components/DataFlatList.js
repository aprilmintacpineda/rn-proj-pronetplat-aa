import React from 'react';
import { FlatList } from 'react-native';
import ListItemSeparator from './ListItemSeparator';
import useDataFetch from 'hooks/useDataFetch';

function defaultKeyExtractor ({ id }) {
  return id;
}

function DataFlatList ({
  endpoint,
  LoadingPlaceHolder,
  keyExtractor = defaultKeyExtractor,
  RowComponent,
  renderItem,
  ListFooterComponent = null,
  ...dataFlatList
}) {
  const {
    data,
    isFirstFetch,
    refreshData,
    isRefreshing,
    fetchData,
    isFetching
  } = useDataFetch({
    endpoint
  });

  const renderRow = React.useCallback(({ item, index }) => {
    return <RowComponent {...item} index={index} />;
  }, []);

  if (isFirstFetch)
    return <LoadingPlaceHolder isFetching={isFetching} isFirstFetch={isFirstFetch} />;

  return (
    <FlatList
      onRefresh={refreshData}
      refreshing={isRefreshing}
      data={data}
      keyExtractor={keyExtractor}
      onEndReached={fetchData}
      onEndReachedThreshold={0.9}
      ListFooterComponent={
        <>
          <LoadingPlaceHolder isFetching={isFetching} isFirstFetch={isFirstFetch} />
          {ListFooterComponent}
        </>
      }
      ItemSeparatorComponent={ListItemSeparator}
      renderItem={RowComponent ? renderRow : renderItem}
      {...dataFlatList}
    />
  );
}

export default React.memo(DataFlatList);
