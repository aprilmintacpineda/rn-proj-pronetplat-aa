import React from 'react';
import { FlatList } from 'react-native';
import DataFetch, { DataFetchContext } from './DataFetch';
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
  ...dataFlatList
}) {
  const {
    data,
    isFirstFetch,
    refreshData,
    isRefreshing,
    fetchData,
    isFetching,
    updateData
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
      renderItem={renderRow}
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
