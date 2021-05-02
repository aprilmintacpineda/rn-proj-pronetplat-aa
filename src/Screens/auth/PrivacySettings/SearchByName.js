import { updateStore } from 'fluxible-js';
import React from 'react';
import useFluxibleStore from 'react-fluxible/lib/useFluxibleStore';
import { Caption, Text } from 'react-native-paper';
import Checkbox from 'components/Checkbox';
import { showRequestFailedPopup } from 'fluxible/actions/popup';
import useState from 'hooks/useState';
import { xhr } from 'libs/xhr';

function mapStates ({ authUser }) {
  return { authUser };
}

function SearchByNameSettings () {
  const { authUser } = useFluxibleStore(mapStates);

  const {
    state: { allowSearchByName, status },
    updateState
  } = useState({
    allowSearchByName: authUser.allowSearchByName,
    status: 'initial'
  });

  const onChange = React.useCallback(
    async isChecked => {
      try {
        updateState({
          status: 'submitting',
          allowSearchByName: isChecked
        });

        const response = await xhr('/change-allow-search-by-name', {
          method: 'post',
          body: { allowSearchByName: isChecked }
        });

        const { userData, authToken } = await response.json();
        updateStore({ authUser: userData, authToken });
        updateState({ status: 'submitSuccess' });
      } catch (error) {
        showRequestFailedPopup();

        updateState({
          status: 'submitError',
          allowSearchByName: !isChecked
        });
      }
    },
    [updateState]
  );

  return (
    <Checkbox
      value={allowSearchByName}
      onChange={onChange}
      disabled={status === 'submitting'}
      content={
        <>
          <Text>Allow others to find me by my name.</Text>
          <Caption>
            When checked, others can search for your account using
            your name.
          </Caption>
        </>
      }
    />
  );
}

export default React.memo(SearchByNameSettings);
