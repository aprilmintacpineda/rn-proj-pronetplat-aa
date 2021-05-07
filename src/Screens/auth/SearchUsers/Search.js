import { useNavigation } from '@react-navigation/core';
import React from 'react';
import { View } from 'react-native';
import { Appbar, Chip, Searchbar } from 'react-native-paper';
import { DataFetchContext } from 'components/DataFetch';
import useDebouncedCallback from 'hooks/useDebouncedCallback';
import useState from 'hooks/useState';
import { paperTheme } from 'theme';

function Search ({ params, setParams }) {
  const { updateData } = React.useContext(DataFetchContext);

  const {
    state: { searchStr, searchBy },
    updateState
  } = useState({
    searchStr: params.search,
    searchBy: params.searchBy
  });
  const { goBack } = useNavigation();

  const startSearch = React.useCallback(
    searchStr => {
      setParams({ searchBy, search: searchStr });
    },
    [setParams, searchBy]
  );

  const search = useDebouncedCallback(startSearch, 500);

  const onChangeText = React.useCallback(
    value => {
      const searchStr = value || '';

      if (searchStr) search(searchStr);
      else updateData([]);

      updateState({ searchStr });
    },
    [updateState, search, updateData]
  );

  const searchByName = React.useCallback(() => {
    if (searchStr)
      setParams({ search: searchStr, searchBy: 'name' });

    updateState({ searchBy: 'name' });
  }, [searchStr, updateState, setParams]);

  const searchByUsername = React.useCallback(() => {
    if (searchStr)
      setParams({ search: searchStr, searchBy: 'username' });

    updateState({ searchBy: 'username' });
  }, [searchStr, updateState, setParams]);

  return (
    <>
      <Searchbar
        icon={Appbar.BackAction}
        onIconPress={goBack}
        placeholder={
          searchBy === 'name'
            ? 'Search by name'
            : 'Search by username'
        }
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
      <View style={{ flexDirection: 'row', margin: 10 }}>
        <Chip
          style={{ marginRight: 10 }}
          selected={searchBy === 'name'}
          onPress={searchByName}
        >
          By name
        </Chip>
        <Chip
          selected={searchBy === 'username'}
          onPress={searchByUsername}
        >
          By username
        </Chip>
      </View>
    </>
  );
}

export default React.memo(Search);
