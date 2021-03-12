import { addEvents } from 'fluxible-js';
import React from 'react';
import { FlatList } from 'react-native';
import DataFetch, { DataFetchContext } from './DataFetch';
import ListEmpty from './ListEmpty';
import ListItemSeparator from './ListItemSeparator';

function defaultKeyExtractor ({ id }) {
  return id;
}

function Body ({
  LoadingPlaceHolder,
  keyExtractor = defaultKeyExtractor,
  RowComponent,
  renderItem,
  ListFooterComponent = null,
  events = {},
  ...dataFlatList
}) {
  const {
    data,
    isFirstFetch,
    refreshData,
    isRefreshing,
    fetchData,
    isFetching,
    updateData,
    filterData,
    concatData
  } = React.useContext(DataFetchContext);

  const renderRow = React.useCallback(
    args => {
      if (RowComponent) {
        const { item, index } = args;
        return <RowComponent {...item} index={index} />;
      }

      return renderItem({
        ...args,
        updateData
      });
    },
    [updateData, RowComponent, renderItem]
  );

  React.useEffect(() => {
    const eventNames = Object.keys(events);

    if (!eventNames.length) return;

    return addEvents(eventNames, (payload, event) => {
      const callback = events[event];
      callback(payload, { filterData, updateData, concatData });
    });
  }, [events, filterData, updateData, concatData]);

  if (isFirstFetch) {
    return (
      <LoadingPlaceHolder
        isFetching={isFetching}
        isFirstFetch={isFirstFetch}
      />
    );
  }

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
          <LoadingPlaceHolder
            isFetching={isFetching}
            isFirstFetch={isFirstFetch}
          />
          {ListFooterComponent}
        </>
      }
      ItemSeparatorComponent={ListItemSeparator}
      renderItem={renderRow}
      ListEmptyComponent={
        <ListEmpty
          onRefresh={refreshData}
          isRefreshing={isRefreshing}
        />
      }
      {...dataFlatList}
    />
  );
}

function DataFlatList ({ endpoint, onSuccess, ...props }) {
  return (
    <DataFetch endpoint={endpoint} onSuccess={onSuccess}>
      <Body {...props} />
    </DataFetch>
  );
}

export default React.memo(DataFlatList);
