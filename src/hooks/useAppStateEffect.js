import React from 'react';
import { AppState } from 'react-native';

function useAppStateEffect ({ onBackground = null, onActive = null, onInactive = null }) {
  const [prevAppState, setPrevAppState] = React.useState(() => AppState.currentState);

  const onChangeListener = React.useCallback(
    newAppState => {
      switch (newAppState) {
        case 'background':
          if (onBackground) onBackground(prevAppState);
          break;
        case 'active':
          if (onActive) onActive(prevAppState);
          break;
        case 'inactive':
          if (onInactive) onInactive(prevAppState);
          break;
      }

      setPrevAppState(newAppState);
    },
    [prevAppState, onBackground, onActive, onInactive]
  );

  React.useEffect(() => {
    AppState.addEventListener('change', onChangeListener);

    return () => {
      AppState.removeEventListener('change', onChangeListener);
    };
  }, [onChangeListener]);

  return null;
}

export default useAppStateEffect;
