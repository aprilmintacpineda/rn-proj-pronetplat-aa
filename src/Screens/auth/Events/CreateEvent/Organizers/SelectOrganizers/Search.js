import React from 'react';
import { Appbar, Searchbar } from 'react-native-paper';
import useDebouncedCallback from 'hooks/useDebouncedCallback';
import useState from 'hooks/useState';
import { paperTheme } from 'theme';

function Search ({ searchParams, setSearchParams, onClose }) {
  const {
    state: { searchStr },
    updateState
  } = useState({
    searchStr: searchParams.search
  });

  const startSearch = React.useCallback(
    searchStr => {
      setSearchParams({ search: searchStr });
    },
    [setSearchParams]
  );

  const search = useDebouncedCallback(startSearch, 500);

  const onChangeText = React.useCallback(
    value => {
      const searchStr = value || '';
      search(searchStr);
      updateState({ searchStr });
    },
    [updateState, search]
  );

  return (
    <Searchbar
      icon={Appbar.BackAction}
      onIconPress={onClose}
      placeholder="Search your contacts"
      onChangeText={onChangeText}
      value={searchStr}
      style={{
        backgroundColor: paperTheme.colors.accent,
        borderRadius: 0
      }}
      iconColor="#fff"
      placeholderTextColor="gray"
      inputStyle={{
        color: '#fff'
      }}
    />
  );
}

export default React.memo(Search);
