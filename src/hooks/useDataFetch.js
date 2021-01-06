import React from 'react';
import useState from './useState';
import { xhrWithParams } from 'libs/xhr';

function useDataFetch ({ endpoint, params = null, prefetch = true }) {
  const {
    state: { data, status, nextToken, error, canFetchMore },
    updateState
  } = useState({
    data: null,
    status: 'initial',
    nextToken: null,
    error: null,
    canFetchMore: true
  });

  const isFetching = status === 'fetching';
  const isInitial = status === 'initial';
  const isRefreshing = status === 'refreshing';
  const isFirstFetch = isInitial || isFetching && !data;

  const filterData = React.useCallback(
    shouldKeep => {
      updateState(({ data }) => {
        if (data.constructor !== Array) return;

        return {
          data: data.filter(shouldKeep)
        };
      });
    },
    [updateState]
  );

  const updateData = React.useCallback(
    updater => {
      updateState(({ data }) => ({
        data: data.constructor === Array ? data.map(updater) : updater(data)
      }));
    },
    [updateState]
  );

  const fetchData = React.useCallback(
    async refresh => {
      const isRefresh = refresh === true;
      if (!isRefresh && !canFetchMore || isFetching) return;

      try {
        updateState({
          status: isRefresh ? 'refreshing' : 'fetching',
          error: null
        });

        console.log('useDataFetch', nextToken, isRefresh);

        const response = await xhrWithParams(endpoint, {
          ...params,
          nextToken: isRefresh ? null : nextToken
        });

        const { data: responseData, nextToken: newNextToken } = await response.json();
        const isDataArray = responseData.constructor === Array;

        console.log('useDataFetch', responseData, newNextToken);

        updateState(({ data }) => {
          const newData = isRefresh
            ? responseData
            : isDataArray
            ? (data || []).concat(responseData || [])
            : responseData;

          return {
            status: 'fetchSuccess',
            data: newData || [],
            nextToken: newNextToken,
            canFetchMore: Boolean(newNextToken)
          };
        });
      } catch (error) {
        console.log('useDataFetch', error);

        updateState({
          status: 'fetchError',
          error
        });
      }
    },
    [endpoint, params, canFetchMore, nextToken, isFetching, updateState]
  );

  const refreshData = React.useCallback(() => {
    if (isFetching || isInitial && prefetch) return;
    fetchData(true);
  }, [isFetching, isInitial, prefetch, fetchData]);

  React.useEffect(() => {
    if (isInitial && prefetch) fetchData();
  }, [prefetch, fetchData, isInitial]);

  return {
    data,
    status,
    nextToken,
    isFetching,
    isInitial,
    isRefreshing,
    isFirstFetch,
    error,
    refreshData,
    fetchData,
    updateData,
    filterData
  };
}

export default useDataFetch;
