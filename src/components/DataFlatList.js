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
  disableRefresh = false,
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
  const isScrolling = React.useRef(false);

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

  const onEndReached = React.useCallback(() => {
    if (!isScrolling.current) return;
    fetchData();
  }, [fetchData]);

  const onMomentumScrollBegin = React.useCallback(() => {
    isScrolling.current = true;
  }, []);

  const onMomentumScrollEnd = React.useCallback(() => {
    isScrolling.current = false;
  }, []);

  React.useEffect(() => {
    if (!eventListeners) return;

    return addEvents(
      Object.keys(eventListeners),
      (payload, event) => {
        const callback = eventListeners[event];
        callback(payload, {
          data,
          replaceData,
          refreshData
        });
      }
    );
  }, [data, eventListeners, replaceData, refreshData]);

  return (
    <FlatList
      onRefresh={!disableRefresh ? refreshData : null}
      refreshing={!disableRefresh && !isFirstFetch && isRefreshing}
      data={data}
      keyExtractor={keyExtractor}
      onEndReached={onEndReached}
      onMomentumScrollBegin={onMomentumScrollBegin}
      onMomentumScrollEnd={onMomentumScrollEnd}
      onEndReachedThreshold={0.7}
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
