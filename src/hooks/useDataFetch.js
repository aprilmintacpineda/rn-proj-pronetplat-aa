import React from 'react';
import useState from './useState';
import { xhrWithParams } from 'libs/xhr';

function useDataFetch ({
  endpoint,
  params = null,
  prefetch = true,
  onSuccess = null,
  onError = null,
  onFetchDone = null
}) {
  const prevParams = React.useRef(params);

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
  const isFirstFetch =
    (isInitial && prefetch) ||
    ((!data || !data.length) && (isFetching || isRefreshing));
  const isError = status === 'fetchError';
  const isSuccess = status === 'fetchSuccess';
  const isFetchDone = isError || isSuccess;

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
      updateState(({ data }) => {
        if (updater.constructor !== Function)
          return { data: updater };

        return {
          data:
            data && data.constructor === Array
              ? data.map(updater)
              : updater(data)
        };
      });
    },
    [updateState]
  );

  const concatData = React.useCallback(
    newData => {
      updateState(({ data }) => ({
        data: data.concat(newData)
      }));
    },
    [updateState]
  );

  const fetchData = React.useCallback(
    async refresh => {
      const isRefresh = refresh === true;
      if ((!isRefresh && !canFetchMore) || isFetching) return;

      try {
        updateState({
          status: isRefresh ? 'refreshing' : 'fetching',
          error: null
        });

        const response = await xhrWithParams(endpoint, {
          ...params,
          nextToken: isRefresh ? null : nextToken
        });

        const {
          data: responseData,
          nextToken: newNextToken = null
        } = await response.json();

        updateState(({ data }) => {
          const newData = isRefresh
            ? responseData
            : responseData.constructor === Array
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
        console.log('useDataFetchError', error);

        updateState({
          status: 'fetchError',
          error
        });
      }
    },
    [
      endpoint,
      params,
      canFetchMore,
      nextToken,
      isFetching,
      updateState
    ]
  );

  const refreshData = React.useCallback(() => {
    if (isFetching || (isInitial && prefetch)) return;
    fetchData(true);
  }, [isFetching, isInitial, prefetch, fetchData]);

  React.useEffect(() => {
    if (isInitial && prefetch) fetchData();
  }, [prefetch, fetchData, isInitial]);

  React.useEffect(() => {
    if (
      prevParams.current !== params &&
      (isFetchDone || isInitial)
    ) {
      prevParams.current = params;
      refreshData();
    }
  }, [params, isFetchDone, refreshData, isInitial]);

  React.useEffect(() => {
    if (isSuccess && onSuccess) onSuccess();
    if (isError && onError) onError();
    if (isFetchDone && onFetchDone)
      onFetchDone({ isSuccess, isError });
  }, [
    isSuccess,
    isError,
    isFetchDone,
    onFetchDone,
    onError,
    onSuccess
  ]);

  return {
    data,
    status,
    nextToken,
    isFetching,
    isInitial,
    isRefreshing,
    isFirstFetch,
    isError,
    isSuccess,
    error,
    refreshData,
    fetchData,
    updateData,
    filterData,
    concatData
  };
}

export default useDataFetch;
