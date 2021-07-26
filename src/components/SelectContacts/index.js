import React from 'react';
import Row from './Row';
import Search from './Search';
import ContactsLoadingPlaceholder from 'components/ContactsLoadingPlaceholder';
import DataFlatList from 'components/DataFlatList';

function SelectContacts ({
  onClose,
  url = '/search-contacts',
  eventListeners,
  ...otherRowProps
}) {
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
      endpoint={url}
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
      eventListeners={eventListeners}
    >
      <Search
        searchParams={searchParams}
        setSearchParams={setSearchParams}
        onClose={onClose}
      />
    </DataFlatList>
  );
}

export default React.memo(SelectContacts);
