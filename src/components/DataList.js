import { addEvents } from 'fluxible-js';
import React from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import DataFetch, { DataFetchContext } from './DataFetch';
import DefaultLoadingPlaceholder from './DefaultLoadingPlaceholder';
import ListEmpty from './ListEmpty';
import ListItemSeparator from './ListItemSeparator';
import TextLink from './TextLink';
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
  ListEmptyComponent = ListEmpty,
  ItemSeparatorComponent = ListItemSeparator,
  otherRowProps,
  fetchMoreLabel = 'See more'
}) {
  const {
    isInitial,
    data,
    isFirstFetch,
    refreshData,
    fetchData,
    isRefreshing,
    isFetching,
    replaceData,
    isError,
    canFetchMore
  } = React.useContext(DataFetchContext);

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

  const dataLen = data?.length || 0;

  return (
    <View>
      {ListHeaderComponent}
      {isFirstFetch && (
        <LoadingPlaceHolder
          isFetching={isFetching}
          isFirstFetch={isFirstFetch}
        />
      )}
      {data &&
        (data.length ? (
          data.map((item, index) => {
            const row = renderRow({ item, index });
            const key = keyExtractor(item);

            return (
              <View key={key}>
                {row}
                {index !== dataLen - 1 && ItemSeparatorComponent && (
                  <ItemSeparatorComponent />
                )}
              </View>
            );
          })
        ) : ListEmptyComponent ? (
          <ListEmptyComponent
            message={listEmptyMessage}
            onRefresh={refreshData}
            isRefreshing={isRefreshing}
          />
        ) : (
          <Text style={{ fontWeight: 'bold' }}>
            {listEmptyMessage}
          </Text>
        ))}
      {!isFirstFetch && (
        <LoadingPlaceHolder
          isFetching={isFetching}
          isFirstFetch={isFirstFetch}
        />
      )}
      {ListFooterComponent}
      {canFetchMore &&
        !isFetching &&
        !isRefreshing &&
        !isInitial && (
          <TextLink onPress={fetchData}>{fetchMoreLabel}</TextLink>
        )}
    </View>
  );
}

function DataList ({
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

export default React.memo(DataList);
