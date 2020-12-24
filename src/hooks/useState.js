import React from 'react';

function useState (initialState) {
  const [state, setState] = React.useState(initialState);

  const updateState = React.useCallback(handler => {
    setState(oldState => {
      const newState = handler.constructor === Function ? handler(oldState) : handler;

      return {
        ...oldState,
        ...newState
      };
    });
  }, []);

  return {
    state,
    updateState,
    setState
  };
}

export default useState;
