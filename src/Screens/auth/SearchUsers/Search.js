import { useNavigation } from '@react-navigation/core';
import React from 'react';
import { View } from 'react-native';
import { Appbar, Chip, Searchbar } from 'react-native-paper';
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

  const startSearch = React.useCallback(() => {
    setSearchParams({ searchBy, search: searchStr });
  }, [setSearchParams, searchBy, searchStr]);

  const onChangeText = React.useCallback(
    value => {
      updateState({ searchStr: value || '' });
    },
    [updateState]
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
        onSubmitEditing={startSearch}
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
