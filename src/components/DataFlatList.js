import { addEvents } from 'fluxible-js';
import React from 'react';
import { FlatList } from 'react-native';
import DataFetch, { DataFetchContext } from './DataFetch';
import DefaultLoadingPlaceholder from './DefaultLoadingPlaceholder';
import ListEmpty from './ListEmpty';
import ListItemSeparator from './ListItemSeparator';

function Body ({
  LoadingPlaceHolder = DefaultLoadingPlaceholder,
  keyField = 'id',
  RowComponent,
  renderItem,
  ListFooterComponent = null,
  eventListeners = null,
  listEmptyMessage,
  ItemSeparatorComponent = ListItemSeparator,
  inverted = false,
  ...flatListProps
}) {
  const {
    data,
    isInitial,
    isFirstFetch,
    refreshData,
    isRefreshing,
    fetchData,
    isFetching,
    replaceData
  } = React.useContext(DataFetchContext);

  const renderRow = React.useCallback(
    args => {
      if (RowComponent) {
        const { item, index } = args;
        return <RowComponent {...item} index={index} />;
      }

      return renderItem(args);
    },
    [RowComponent, renderItem]
  );

  const keyExtractor = React.useCallback(
    item => item[keyField],
    [keyField]
  );

  React.useEffect(() => {
    if (!eventListeners) return;

    return addEvents(
      Object.keys(eventListeners),
      (payload, event) => {
        const callback = eventListeners[event];
        callback(payload, {
          replaceData,
          refreshData
        });
      }
    );
  }, [eventListeners, replaceData, refreshData]);

  return (
    <FlatList
      onRefresh={refreshData}
      refreshing={!isFirstFetch && isRefreshing}
      data={data}
      keyExtractor={keyExtractor}
      onEndReached={fetchData}
      onEndReachedThreshold={0.9}
      inverted={data?.length && inverted}
      ListHeaderComponent={
        isFirstFetch && (
          <LoadingPlaceHolder
            isFetching={isFetching}
            isFirstFetch={isFirstFetch}
          />
        )
      }
      ListFooterComponent={
        !isFirstFetch && (
          <>
            <LoadingPlaceHolder
              isFetching={isFetching}
              isFirstFetch={isFirstFetch}
            />
            {ListFooterComponent}
          </>
        )
      }
      ItemSeparatorComponent={ItemSeparatorComponent}
      renderItem={renderRow}
      ListEmptyComponent={
        !isFirstFetch &&
        !isInitial &&
        !isFetching && (
          <ListEmpty
            message={listEmptyMessage}
            onRefresh={refreshData}
            isRefreshing={isRefreshing}
          />
        )
      }
      {...flatListProps}
    />
  );
}

function DataFlatList ({
  endpoint,
  onSuccess,
  prefetch = true,
  children,
  params = null,
  ...props
}) {
  return (
    <DataFetch
      endpoint={endpoint}
      onSuccess={onSuccess}
      prefetch={prefetch}
      params={params}
    >
      {children}
      <Body {...props} />
    </DataFetch>
  );
}

export default React.memo(DataFlatList);
