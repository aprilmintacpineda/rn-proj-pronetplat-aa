import { useNavigation } from '@react-navigation/core';
import React from 'react';
import { Appbar, Searchbar } from 'react-native-paper';
import { DataFetchContext } from 'components/DataFetch';
import useDebouncedCallback from 'hooks/useDebouncedCallback';
import useState from 'hooks/useState';

function Search ({ setParams }) {
  const { updateData } = React.useContext(DataFetchContext);

  const {
    state: { searchStr, status },
    updateState
  } = useState({
    searchStr: '',
    status: 'initial'
  });
  const { goBack } = useNavigation();

  const startSearch = React.useCallback(() => {
    setParams({ search: searchStr });
  }, [setParams, searchStr]);

  const search = useDebouncedCallback(startSearch, 500);

  React.useEffect(() => {
    if (status === 'initial') return;
    if (!searchStr) updateData([]);
    else search();
  }, [searchStr, search, status, updateData]);

  const onChangeText = React.useCallback(
    value => {
      updateState({
        searchStr: value || null,
        status: 'touched'
      });
    },
    [updateState]
  );

  return (
    <Searchbar
      icon={Appbar.BackAction}
      onIconPress={goBack}
      placeholder="Search by name"
      onChangeText={onChangeText}
      value={searchStr}
    />
  );
}

export default React.memo(Search);
