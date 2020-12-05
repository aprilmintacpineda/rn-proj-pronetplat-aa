import React from 'react';
import { xhrWithParams } from 'libs/xhr';

function useDataFetch ({ endpoint, params = null, prefetch = false }) {
  const [{ data, status, currentPage, error, canFetchMore }, setState] = React.useState({
    data: null,
    status: 'initial',
    currentPage: 0,
    error: null,
    canFetchMore: true
  });

  const isFetching = status === 'fetching';
  const isInitial = status === 'initial';

  const fetchData = React.useCallback(
    async refresh => {
      const isRefresh = refresh === true;
      if (!isRefresh && !canFetchMore) return;

      try {
        setState(oldState => ({
          ...oldState,
          status: isRefresh ? 'refreshing' : 'fetching',
          error: null
        }));

        const nextPage = isRefresh ? 1 : currentPage + 1;

        let responseData = await xhrWithParams(endpoint, {
          ...params,
          page: nextPage > 1 ? nextPage : null
        });

        responseData = await responseData.json();

        const newData = isRefresh
          ? responseData
          : responseData.constructor === Array
          ? (data || []).concat(responseData)
          : responseData;

        setState(oldState => ({
          ...oldState,
          status: 'fetchSuccess',
          data: newData,
          currentPage: nextPage,
          canFetchMore: responseData.length > 0
        }));
      } catch (error) {
        console.log('useDataFetch', error);

        setState(oldState => ({
          ...oldState,
          status: 'fetchError',
          error
        }));
      }
    },
    [currentPage, endpoint, params, canFetchMore, data]
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
    currentPage,
    isFetching,
    isInitial,
    error,
    refreshData,
    fetchData
  };
}

export default useDataFetch;
