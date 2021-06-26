import { useIsFocused } from '@react-navigation/core';
import { updateStore } from 'fluxible-js';
import React from 'react';
import useFluxibleStore from 'react-fluxible/lib/useFluxibleStore';
import { DataFetchContext } from 'components/DataFetch';

function mapStates ({ refreshInbox }) {
  return { refreshInbox };
}

function RefreshController () {
  const { refreshInbox } = useFluxibleStore(mapStates);
  const isFocused = useIsFocused();
  const { refreshData } = React.useContext(DataFetchContext);

  React.useEffect(() => {
    if (isFocused && refreshInbox) {
      refreshData();
      updateStore({ refreshInbox: false });
    }
  }, [isFocused, refreshInbox, refreshData]);

  return null;
}

export default React.memo(RefreshController);
