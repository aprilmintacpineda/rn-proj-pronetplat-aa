import { emitEvent, store } from 'fluxible-js';
import { WEBSOCKET_URL } from 'env';

let webSocket = null;

function createConnection () {
  return new WebSocket(WEBSOCKET_URL, undefined, {
    headers: {
      Authorization: `Bearer ${store.authToken}`
    }
  });
}

export function initConnection () {
  let unmounted = false;
  let reconnectTimeout = null;

  function connect () {
    webSocket = null;
    webSocket = createConnection();

    webSocket.onopen = () => {
      console.log('websocket connected');
    };

    webSocket.onerror = err => {
      console.log('websocket.onerror', err);

      if (!unmounted) {
        clearTimeout(reconnectTimeout);

        reconnectTimeout = setTimeout(() => {
          connect();
        }, 3000);
      }
    };

    webSocket.onclose = () => {
      console.log('websocket closed');

      if (!unmounted) {
        clearTimeout(reconnectTimeout);

        reconnectTimeout = setTimeout(() => {
          connect();
        }, 3000);
      }
    };

    webSocket.onmessage = async ({ data }) => {
      const { event, ...payload } = JSON.parse(data);
      emitEvent(event, payload);
    };
  }

  connect();

  return () => {
    unmounted = true;
    clearTimeout(reconnectTimeout);
    webSocket.close();
  };
}
