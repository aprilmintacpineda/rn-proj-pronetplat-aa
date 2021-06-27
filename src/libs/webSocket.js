import { emitEvent, store } from 'fluxible-js';
import BackgroundTimer from 'react-native-background-timer';
import { WEBSOCKET_URL } from 'env';

let webSocket = null;

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
  BackgroundTimer.stopBackgroundTimer();

  // ping every 9 minute to keep connection alive
  BackgroundTimer.runBackgroundTimer(() => {
    BackgroundTimer.stopBackgroundTimer();
    sendMessage('ping');
  }, 540000);
}

export function clearWebSocket () {
  BackgroundTimer.stopBackgroundTimer();

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

  // reconnect after 3 seconds
  BackgroundTimer.runBackgroundTimer(() => {
    BackgroundTimer.stopBackgroundTimer();
    connectWebSocket();
  }, 3000);
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
    console.log('websocketEvent', data);

    if (data === 'pong') {
      schedulePing();
      return;
    }

    const parsedData = JSON.parse(data);

    if (parsedData.message === 'Internal server error') {
      restartConnection(data);
    } else {
      schedulePing();
      emitEvent('websocketEvent', parsedData);
      emitEvent(`websocketEvent-${parsedData.type}`, parsedData);
    }
  };
}
