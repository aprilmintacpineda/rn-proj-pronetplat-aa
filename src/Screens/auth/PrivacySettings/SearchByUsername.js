import { updateStore } from 'fluxible-js';
import React from 'react';
import useFluxibleStore from 'react-fluxible/lib/useFluxibleStore';
import { Caption, Text } from 'react-native-paper';
import Switch from 'components/Switch';
import { showRequestFailedPopup } from 'fluxible/actions/popup';
import useState from 'hooks/useState';
import { xhr } from 'libs/xhr';

function mapStates ({ authUser }) {
  return { authUser };
}

function SearchByNameSettings () {
  const { authUser } = useFluxibleStore(mapStates);

  const {
    state: { allowSearchByUsername, status },
    updateState
  } = useState({
    allowSearchByUsername: authUser.allowSearchByUsername,
    status: 'initial'
  });

  const onChange = React.useCallback(
    async isChecked => {
      try {
        updateState({
          status: 'submitting',
          allowSearchByUsername: isChecked
        });

        const response = await xhr(
          '/change-allow-search-by-username',
          {
            method: 'post',
            body: { allowSearchByUsername: isChecked }
          }
        );

        const { userData, authToken } = await response.json();
        updateStore({ authUser: userData, authToken });
        updateState({ status: 'submitSuccess' });
      } catch (error) {
        showRequestFailedPopup();

        updateState({
          status: 'submitError',
          allowSearchByUsername: !isChecked
        });
      }
    },
    [updateState]
  );

  return (
    <Switch
      value={allowSearchByUsername}
      onChange={onChange}
      disabled={status === 'submitting'}
      content={
        <>
          <Text>Allow others to find me by my username.</Text>
          <Caption>
            When checked, others can search for your account using
            your username.
          </Caption>
        </>
      }
    />
  );
}

export default React.memo(SearchByNameSettings);
