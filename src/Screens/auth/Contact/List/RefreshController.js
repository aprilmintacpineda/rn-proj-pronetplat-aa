import { useIsFocused } from '@react-navigation/core';
import { updateStore } from 'fluxible-js';
import React from 'react';
import useFluxibleStore from 'react-fluxible/lib/useFluxibleStore';
import { DataFetchContext } from 'components/DataFetch';

function mapStates ({ refreshMyContactList }) {
  return { refreshMyContactList };
}

function RefreshController () {
  const { refreshMyContactList } = useFluxibleStore(mapStates);
  const isFocused = useIsFocused();
  const { refreshData } = React.useContext(DataFetchContext);

  React.useEffect(() => {
    if (isFocused && refreshMyContactList) {
      refreshData();
      updateStore({ refreshMyContactList: false });
    }
  }, [isFocused, refreshMyContactList, refreshData]);

  return null;
}

export default React.memo(RefreshController);
