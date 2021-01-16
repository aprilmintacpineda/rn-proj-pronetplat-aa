import { store, updateStore } from 'fluxible-js';
import React from 'react';
import { Text } from 'react-native-paper';
import Animatable from 'components/Animatable';
import { paperTheme } from 'theme';

const { success, error } = paperTheme.colors;

function Toast ({ id, message, icon = null, type, updateCount }) {
  const [hasExpired, setHasExpired] = React.useState(false);
  const prevUpdateCount = React.useRef(updateCount);
  const timeout = React.useRef();

  const removeToast = React.useCallback(() => {
    if (!hasExpired) return;

    updateStore({
      toasts: store.toasts.filter(toast => toast.id !== id)
    });
  }, [hasExpired, id]);

  React.useEffect(() => {
    if (updateCount !== prevUpdateCount.current)
      prevUpdateCount.current = updateCount;

    timeout.current = setTimeout(() => {
      setHasExpired(true);
    }, 3000);

    return () => {
      clearTimeout(timeout.current);
      setHasExpired(false);
    };
  }, [id, updateCount]);

  const color =
    type === 'success'
      ? success
      : type === 'error'
      ? error
      : undefined;

  return (
    <Animatable
      animation={hasExpired ? 'fadeOutToBottom' : 'fadeInFromBottom'}
      onAnimationEnd={removeToast}
      style={{
        backgroundColor: '#fff',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 4,
        marginBottom: 10,
        elevation: 4,
        shadowColor: color || '#000',
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        borderColor: color,
        borderWidth: type ? 1 : 0,
        flexDirection: 'row',
        alignItems: 'center'
      }}
    >
      {icon}
      <Text style={{ marginLeft: icon ? 10 : 0 }}>{message}</Text>
    </Animatable>
  );
}

export default React.memo(Toast);
