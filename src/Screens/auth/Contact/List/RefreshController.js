import { useIsFocused } from '@react-navigation/core';
import { updateStore } from 'fluxible-js';
import React from 'react';
import useFluxibleStore from 'react-fluxible/lib/useFluxibleStore';
import { DataFetchContext } from 'components/DataFetch';

function mapStates ({ screensToRefresh }) {
  return { screensToRefresh };
}

function RefreshController () {
  const { screensToRefresh } = useFluxibleStore(mapStates);
  const isFocused = useIsFocused();
  const { refreshData } = React.useContext(DataFetchContext);

  React.useEffect(() => {
    const index = screensToRefresh.indexOf('ContactList');

    if (isFocused && index !== -1) {
      updateStore({
        screensToRefresh: screensToRefresh.filter(
          screen => screen !== 'ContactList'
        )
      });

      refreshData();
    }
  }, [isFocused, screensToRefresh, refreshData]);

  return null;
}

export default React.memo(RefreshController);
