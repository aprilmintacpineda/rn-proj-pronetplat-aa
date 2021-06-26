import { emitEvent, store } from 'fluxible-js';
import { WEBSOCKET_URL } from 'env';

let webSocket = null;
let pingTimeout = null;
let restartConnectionTimeout = null;

export function sendMessage (action, data = {}) {
  console.log('sendMessage', action);

  webSocket.send(
    JSON.stringify({
      action,
      data
    })
  );
}

function schedulePing () {
  console.log('schedulePing');

  // ping every 1 minute to keep connection alive
  pingTimeout = setTimeout(() => {
    sendMessage('ping');
  }, 60000);
}

export function clearWebSocket () {
  clearTimeout(pingTimeout);
  clearTimeout(restartConnectionTimeout);

  webSocket.onopen = null;
  webSocket.onclose = null;
  webSocket.onerror = null;
  webSocket.onmessage = null;
  webSocket.close();

  console.log('webSocket closed');
}

function restartConnection (err) {
  console.log('restartConnection', err);
  clearWebSocket();

  restartConnectionTimeout = setTimeout(() => {
    connectWebSocket();
  }, 30000);
}

export function connectWebSocket () {
  console.log('connecting');

  webSocket = new WebSocket(WEBSOCKET_URL, undefined, {
    headers: {
      Authorization: `Bearer ${store.authToken}`
    }
  });

  webSocket.onopen = schedulePing;
  webSocket.onclose = restartConnection;
  webSocket.onerror = restartConnection;

  webSocket.onmessage = async ({ data }) => {
    schedulePing();
    if (data === 'pong') return;
    console.log('websocketEvent', data);
    const parsedData = JSON.parse(data);

    if (parsedData.message === 'Internal server error') {
      restartConnection(data);
    } else {
      emitEvent('websocketEvent', parsedData);
      emitEvent(`websocketEvent-${parsedData.type}`, parsedData);
    }
  };
}
