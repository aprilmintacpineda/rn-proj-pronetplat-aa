import React from 'react';

function useState (initialState) {
  const [state, setState] = React.useState(initialState);

  const updateState = React.useCallback(updater => {
    setState(oldState => {
      const newState = updater.constructor === Function ? updater(oldState) : updater;

      return {
        ...oldState,
        ...newState
      };
    });
  }, []);

  return { state, updateState, setState };
}

export default useState;
