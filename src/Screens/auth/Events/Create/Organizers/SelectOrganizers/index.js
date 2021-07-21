import React from 'react';
import Row from './Row';
import Search from './Search';
import ContactsLoadingPlaceholder from 'components/ContactsLoadingPlaceholder';
import DataFlatList from 'components/DataFlatList';

function SelectOrganizers ({ onClose, ...otherRowProps }) {
  const [searchParams, setSearchParams] = React.useState({
    search: ''
  });

  const onParamsChange = React.useCallback(
    ({ params }, { refreshData }) => {
      if (params.search.length !== 1) refreshData(true);
    },
    []
  );

  return (
    <DataFlatList
      endpoint={
        searchParams.search ? '/search-contacts' : '/my-contacts'
      }
      params={searchParams}
      LoadingPlaceHolder={ContactsLoadingPlaceholder}
      RowComponent={Row}
      listEmptyMessage={
        searchParams.search
          ? 'No results found.'
          : 'You have no contacts yet.'
      }
      otherRowProps={otherRowProps}
      onParamsChange={onParamsChange}
    >
      <Search
        searchParams={searchParams}
        setSearchParams={setSearchParams}
        onClose={onClose}
      />
    </DataFlatList>
  );
}

export default React.memo(SelectOrganizers);
