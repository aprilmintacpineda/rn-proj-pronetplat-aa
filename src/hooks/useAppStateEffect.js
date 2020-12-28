import React from 'react';
import { AppState } from 'react-native';

function useAppStateEffect ({ onBackground = null, onActive = null, onInactive = null }) {
  const prevAppState = React.useRef(AppState.currentState);

  const onChangeListener = React.useCallback(
    newAppState => {
      switch (newAppState) {
        case 'background':
          if (onBackground) onBackground(prevAppState.current);
          break;
        case 'active':
          if (onActive) onActive(prevAppState.current);
          break;
        case 'inactive':
          if (onInactive) onInactive(prevAppState.current);
          break;
      }

      prevAppState.current = newAppState;
    },
    [onBackground, onActive, onInactive]
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
