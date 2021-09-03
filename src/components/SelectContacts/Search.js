import React from 'react';
import { Searchbar } from 'react-native-paper';
import RNVectorIcon from 'components/RNVectorIcon';
import useState from 'hooks/useState';
import { paperTheme } from 'theme';

function closeIcon (props) {
  return (
    <RNVectorIcon provider="Ionicons" name="close" {...props} />
  );
}

function Search ({ searchParams, setSearchParams, onClose }) {
  const {
    state: { searchStr },
    updateState
  } = useState({
    searchStr: searchParams.search
  });

  const startSearch = React.useCallback(() => {
    setSearchParams({ search: searchStr });
  }, [setSearchParams, searchStr]);

  const onChangeText = React.useCallback(
    value => {
      updateState({ searchStr: value || '' });
    },
    [updateState]
  );

  return (
    <Searchbar
      icon={closeIcon}
      onIconPress={onClose}
      placeholder="Search your contacts"
      onChangeText={onChangeText}
      onSubmitEditing={startSearch}
      maxLength={255}
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
