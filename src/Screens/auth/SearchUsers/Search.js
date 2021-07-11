import { useNavigation } from '@react-navigation/core';
import React from 'react';
import { View } from 'react-native';
import { Appbar, Chip, Searchbar } from 'react-native-paper';
import useDebouncedCallback from 'hooks/useDebouncedCallback';
import useState from 'hooks/useState';
import { paperTheme } from 'theme';

function Search ({ searchParams, setSearchParams }) {
  const {
    state: { searchStr, searchBy },
    updateState
  } = useState({
    searchStr: searchParams.search,
    searchBy: searchParams.searchBy
  });
  const { goBack } = useNavigation();

  const startSearch = React.useCallback(
    searchStr => {
      setSearchParams({ searchBy, search: searchStr });
    },
    [setSearchParams, searchBy]
  );

  const search = useDebouncedCallback(startSearch, 500);

  const onChangeText = React.useCallback(
    value => {
      const searchStr = value || '';

      if (searchStr) search(searchStr);
      else startSearch(searchStr);

      updateState({ searchStr });
    },
    [updateState, search, startSearch]
  );

  const searchByName = React.useCallback(() => {
    if (searchStr)
      setSearchParams({ search: searchStr, searchBy: 'name' });

    updateState({ searchBy: 'name' });
  }, [searchStr, updateState, setSearchParams]);

  const searchByUsername = React.useCallback(() => {
    if (searchStr)
      setSearchParams({ search: searchStr, searchBy: 'username' });

    updateState({ searchBy: 'username' });
  }, [searchStr, updateState, setSearchParams]);

  return (
    <>
      <Searchbar
        icon={Appbar.BackAction}
        onIconPress={goBack}
        placeholder={`Search users by ${searchBy}`}
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
