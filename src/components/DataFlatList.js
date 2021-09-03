import { addEvents } from 'fluxible-js';
import React from 'react';
import { FlatList } from 'react-native';
import DataFetch, { DataFetchContext } from './DataFetch';
import DefaultLoadingPlaceholder from './DefaultLoadingPlaceholder';
import ListEmpty from './ListEmpty';
import ListItemSeparator from './ListItemSeparator';
import UnknownErrorView from './UnknownErrorView';

function Body ({
  LoadingPlaceHolder = DefaultLoadingPlaceholder,
  keyField = 'id',
  RowComponent,
  renderItem,
  ListFooterComponent = null,
  ListHeaderComponent = null,
  eventListeners = null,
  listEmptyMessage,
  ItemSeparatorComponent = ListItemSeparator,
  inverted = false,
  disableRefresh = false,
  otherRowProps,
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
    replaceData,
    isError
  } = React.useContext(DataFetchContext);
  const isScrolling = React.useRef(false);

  const renderRow = React.useCallback(
    args => {
      if (RowComponent) {
        const { item, index } = args;

        return (
          <RowComponent {...item} {...otherRowProps} index={index} />
        );
      }

      return renderItem(args);
    },
    [RowComponent, renderItem, otherRowProps]
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

  if (isError) return <UnknownErrorView onRefresh={refreshData} />;

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
        <>
          {ListHeaderComponent}
          {isFirstFetch && (
            <LoadingPlaceHolder
              isFetching={isFetching || isRefreshing}
              isFirstFetch={isFirstFetch}
            />
          )}
        </>
      }
      ListFooterComponent={
        !isFirstFetch && (
          <>
            <LoadingPlaceHolder
              isFetching={isFetching || isRefreshing}
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
            onRefresh={refreshData || isRefreshing}
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
  onParamsChange,
  ...props
}) {
  return (
    <DataFetch
      endpoint={endpoint}
      onSuccess={onSuccess}
      prefetch={prefetch}
      params={params}
      onParamsChange={onParamsChange}
    >
      {children}
      <Body {...props} />
    </DataFetch>
  );
}

export default React.memo(DataFlatList);
