import React from 'react';
import { AppState } from 'react-native';

function useAppStateEffect ({
  onBackground = null,
  onActive = null
}) {
  const prevAppState = React.useRef(AppState.currentState);

  const onChangeListener = React.useCallback(
    newAppState => {
      switch (newAppState) {
        case 'inactive':
        case 'background':
          if (onBackground) onBackground(prevAppState.current);
          break;
        case 'active':
          if (onActive) onActive(prevAppState.current);
          break;
      }

      prevAppState.current = newAppState;
    },
    [onBackground, onActive]
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
