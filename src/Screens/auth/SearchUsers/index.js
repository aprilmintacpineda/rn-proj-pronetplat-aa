import React from 'react';
import Row from './Row';
import Search from './Search';
import ContactsLoadingPlaceholder from 'components/ContactsLoadingPlaceholder';
import DataFlatList from 'components/DataFlatList';

function SearchUsers () {
  const [params, setParams] = React.useState({
    search: '',
    searchBy: 'name'
  });

  return (
    <DataFlatList
      endpoint="/search-users"
      prefetch={false}
      params={params}
      LoadingPlaceHolder={ContactsLoadingPlaceholder}
      RowComponent={Row}
      listEmptyMessage="No results found."
    >
      <Search params={params} setParams={setParams} />
    </DataFlatList>
  );
}

export default React.memo(SearchUsers);
