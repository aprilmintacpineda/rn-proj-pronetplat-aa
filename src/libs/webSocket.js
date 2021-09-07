import { emitEvent, store } from 'fluxible-js';
import { Platform } from 'react-native';
import BackgroundTimer from 'react-native-background-timer';
import config from 'react-native-config';

let webSocket = null;
let willReconnect = false;

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

  // ping every 8 minute to keep connection alive
  BackgroundTimer.runBackgroundTimer(() => {
    BackgroundTimer.stopBackgroundTimer();
    sendMessage('ping');
  }, 480000);
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
  if (willReconnect) {
    console.log('restartConnection skipped', err);
    return;
  }

  console.log('restartConnection', err);
  willReconnect = true;
  clearWebSocket();
  connectWebSocket();
  willReconnect = false;
}

export function connectWebSocket () {
  console.log('connecting');

  webSocket = new WebSocket(config.WEBSOCKET_URL, undefined, {
    headers: {
      Authorization: `Bearer ${store.authToken}`
    }
  });

  webSocket.onopen = schedulePing;
  webSocket.onclose = restartConnection;
  webSocket.onerror = restartConnection;

  webSocket.onmessage = async ({ data }) => {
    console.log(`webSocket.onmessage ${Platform.OS}`, data);

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

      if (parsedData.type)
        emitEvent(`websocketEvent-${parsedData.type}`, parsedData);

      if (parsedData.trigger) {
        emitEvent(
          `websocketEvent-${parsedData.trigger}`,
          parsedData
        );
      }
    }
  };
}
