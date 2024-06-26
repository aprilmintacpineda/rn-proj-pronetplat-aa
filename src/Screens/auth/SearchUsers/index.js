import React from 'react';
import Row from './Row';
import Search from './Search';
import ContactsLoadingPlaceholder from 'components/ContactsLoadingPlaceholder';
import DataFlatList from 'components/DataFlatList';

function SearchUsers () {
  const [searchParams, setSearchParams] = React.useState({
    search: '',
    searchBy: 'name'
  });

  const onParamsChange = React.useCallback(
    ({ params }, { refreshData, replaceData }) => {
      if (params.search.length === 1) return;
      if (!params.search) replaceData([]);
      else refreshData(true);
    },
    []
  );

  return (
    <DataFlatList
      endpoint="/search-users"
      prefetch={false}
      params={searchParams}
      LoadingPlaceHolder={ContactsLoadingPlaceholder}
      RowComponent={Row}
      listEmptyMessage="No results found."
      onParamsChange={onParamsChange}
    >
      <Search
        searchParams={searchParams}
        setSearchParams={setSearchParams}
      />
    </DataFlatList>
  );
}

export default React.memo(SearchUsers);
