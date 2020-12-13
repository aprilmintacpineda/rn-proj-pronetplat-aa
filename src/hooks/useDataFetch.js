import React from 'react';
import { xhrWithParams } from 'libs/xhr';

function useDataFetch ({ endpoint, params = null, prefetch = true }) {
  const [{ data, status, nextToken, error, canFetchMore }, setState] = React.useState({
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

  const fetchData = React.useCallback(
    async refresh => {
      const isRefresh = refresh === true;
      if (!isRefresh && !canFetchMore || isFetching) return;

      try {
        setState(oldState => ({
          ...oldState,
          status: isRefresh ? 'refreshing' : 'fetching',
          error: null
        }));

        const response = await xhrWithParams(endpoint, {
          ...params,
          nextToken: isRefresh ? null : nextToken
        });

        const { data, nextToken: newNextToken } = await response.json();
        const isDataArray = data.constructor === Array;

        setState(oldState => {
          const newData = isRefresh
            ? data
            : isDataArray
            ? (oldState.data || []).concat(data || [])
            : data;

          return {
            ...oldState,
            status: 'fetchSuccess',
            data: newData || [],
            nextToken: newNextToken,
            canFetchMore: Boolean(newNextToken)
          };
        });
      } catch (error) {
        console.log('useDataFetch', error);

        setState(oldState => ({
          ...oldState,
          status: 'fetchError',
          error
        }));
      }
    },
    [endpoint, params, canFetchMore, nextToken, isFetching]
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
    fetchData
  };
}

export default useDataFetch;
