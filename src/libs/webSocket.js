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

export function initConnection () {
  function schedulePing () {
    console.log('schedulePing');

    // ping every 1 minute to keep connection alive
    BackgroundTimer.runBackgroundTimer(() => {
      BackgroundTimer.stopBackgroundTimer();
      sendMessage('ping');
    }, 30000);
  }

  function clearConnection () {
    BackgroundTimer.stopBackgroundTimer();

    webSocket.onopen = null;
    webSocket.onclose = null;
    webSocket.onerror = null;
    webSocket.onmessage = null;
    webSocket.close();

    console.log('closed webSocket');
  }

  function restartConnection (err) {
    console.log('restartConnection', err);
    clearConnection();

    BackgroundTimer.runBackgroundTimer(() => {
      BackgroundTimer.stopBackgroundTimer();
      connect();
    }, 30000);
  }

  function connect () {
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
      const parsedData = JSON.parse(data);

      if (parsedData.message === 'Internal server error') {
        restartConnection(data);
      } else {
        emitEvent('websocketEvent', parsedData);
        emitEvent(`websocketEvent-${parsedData.type}`, parsedData);
      }
    };
  }

  connect();
  return clearConnection;
}
