import React from 'react';
import useDataFetch from 'hooks/useDataFetch';

export const DataFetchContext = React.createContext();

function DataFetch ({ children, ...dataFetchParams }) {
  const value = useDataFetch(dataFetchParams);

  return <DataFetchContext.Provider value={value}>{children}</DataFetchContext.Provider>;
}

export default React.memo(DataFetch);
