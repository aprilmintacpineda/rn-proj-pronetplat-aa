import { emitEvent, store } from 'fluxible-js';
import BackgroundTimer from 'react-native-background-timer';
import { WEBSOCKET_URL } from 'env';

let webSocket = null;

export function sendMessage (action, data = {}) {
  webSocket.send(
    JSON.stringify({
      action,
      data
    })
  );
}

export function initConnection () {
  let reconnectTimeout = null;

  function schedulePing () {
    console.log('schedulePing');
    BackgroundTimer.stopBackgroundTimer();

    // ping every 5 minute to keep connection alive
    BackgroundTimer.runBackgroundTimer(() => {
      sendMessage('ping');
    }, 300000);
  }

  function scheduleRconnect () {
    console.log('scheduleRconnect');
    clearTimeout(reconnectTimeout);

    reconnectTimeout = setTimeout(() => {
      connect();
    }, 3000);
  }

  function restartConnection (err) {
    console.log('restartConnection', err);
    clearTimeout(reconnectTimeout);
    BackgroundTimer.stopBackgroundTimer();
    scheduleRconnect();
  }

  function connect () {
    console.log('connecting');

    clearTimeout(reconnectTimeout);
    BackgroundTimer.stopBackgroundTimer();

    webSocket = new WebSocket(WEBSOCKET_URL, undefined, {
      headers: {
        Authorization: `Bearer ${store.authToken}`
      }
    });

    webSocket.onopen = schedulePing;
    webSocket.onclose = restartConnection;
    webSocket.onerror = restartConnection;

    webSocket.onmessage = async ({ data }) => {
      if (data === 'pong') return;
      const parsedData = JSON.parse(data);
      emitEvent('websocketEvent', parsedData);
      emitEvent(`websocketEvent-${parsedData.type}`, parsedData);
    };
  }

  connect();

  return () => {
    clearTimeout(reconnectTimeout);
    BackgroundTimer.stopBackgroundTimer();

    webSocket.close();
    console.log('closed webSocket');
  };
}
