import React from 'react';
import useState from './useState';
import { xhr } from 'libs/xhr';

function useDataFetch ({
  endpoint,
  params = null,
  prefetch = true,
  onSuccess = null,
  onError = null,
  onFetchDone = null,
  onParamsChange
}) {
  const prevParams = React.useRef(params);
  const prevEndpoint = React.useRef(endpoint);

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

  const replaceData = React.useCallback(
    handle => {
      if (typeof handle === 'function')
        updateState(({ data }) => ({ data: handle(data) }));
      else updateState({ data: handle });
    },
    [updateState]
  );

  const fetchData = React.useCallback(
    async (refresh, clearData) => {
      const isRefresh = refresh === true;
      if ((!isRefresh && !canFetchMore) || isFetching) return;

      try {
        updateState(({ data }) => ({
          status: isRefresh ? 'refreshing' : 'fetching',
          error: null,
          data: isRefresh && clearData ? null : data
        }));

        const response = await xhr(endpoint, {
          params: {
            ...params,
            nextToken: isRefresh ? null : nextToken
          }
        });

        const {
          data: responseData,
          nextToken: newNextToken = null
        } = await response.json();

        updateState(({ data }) => {
          const newData = isRefresh
            ? responseData || []
            : responseData.constructor === Array
            ? (data || []).concat(responseData || [])
            : responseData || [];

          return {
            status: 'fetchSuccess',
            data: newData || [],
            nextToken: newNextToken,
            canFetchMore: Boolean(newNextToken)
          };
        });
      } catch (error) {
        console.log('useDataFetchError', error);

        updateState(({ data }) => ({
          status: 'fetchError',
          error,
          data: isRefresh && error.status === 404 ? null : data
        }));
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

  const refreshData = React.useCallback(
    (clearData = false) => {
      if (isFetching || (isInitial && prefetch)) return;
      fetchData(true, clearData);
    },
    [isFetching, isInitial, prefetch, fetchData]
  );

  React.useEffect(() => {
    if (isInitial && prefetch) fetchData();
  }, [prefetch, fetchData, isInitial]);

  React.useEffect(() => {
    if (
      (prevParams.current !== params ||
        prevEndpoint.current !== endpoint) &&
      (isFetchDone || isInitial)
    ) {
      prevParams.current = params;
      prevEndpoint.current = endpoint;
      if (onParamsChange) {
        onParamsChange(
          { params, endpoint },
          { refreshData, replaceData }
        );
      } else {
        refreshData(true);
      }
    }
  }, [
    params,
    isFetchDone,
    refreshData,
    isInitial,
    prefetch,
    endpoint,
    replaceData,
    onParamsChange
  ]);

  React.useEffect(() => {
    if (isSuccess && onSuccess) onSuccess(data);
    if (isError && onError) onError();
    if (isFetchDone && onFetchDone)
      onFetchDone({ isSuccess, isError });
  }, [
    isSuccess,
    isError,
    isFetchDone,
    onFetchDone,
    onError,
    onSuccess,
    data
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
    replaceData,
    canFetchMore
  };
}

export default useDataFetch;
