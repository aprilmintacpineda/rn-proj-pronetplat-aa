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
    console.log('connecting');
    webSocket = null;
    webSocket = createConnection();

    webSocket.onopen = () => {
      console.log('websocket connected');
    };

    webSocket.onerror = () => {
      console.log('websocket error');

      if (!unmounted) {
        clearTimeout(reconnectTimeout);

        reconnectTimeout = setTimeout(() => {
          connect();
        }, 1000);
      }
    };

    webSocket.onclose = () => {
      console.log('websocket closed');

      if (!unmounted) {
        clearTimeout(reconnectTimeout);

        reconnectTimeout = setTimeout(() => {
          connect();
        }, 1000);
      }
    };

    webSocket.onmessage = async ({ data }) => {
      const parsedData = JSON.parse(data);
      emitEvent('websocketEvent', parsedData);
      emitEvent(`websocketEvent-${parsedData.type}`, parsedData);
    };
  }

  connect();

  return () => {
    unmounted = true;
    clearTimeout(reconnectTimeout);
    webSocket.close();
    console.log('unmounted');
  };
}
