import React from 'react';

function useDebouncedCallback (callback, milliseconds) {
  const timer = React.useRef();

  return React.useMemo(() => {
    return (...args) => {
      clearTimeout(timer.current);

      timer.current = setTimeout(() => {
        callback(...args);
      }, milliseconds);
    };
  }, [callback, milliseconds]);
}

export default useDebouncedCallback;
