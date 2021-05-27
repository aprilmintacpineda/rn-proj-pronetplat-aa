import { emitEvent, store } from 'fluxible-js';
import BackgroundTimer from 'react-native-background-timer';
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
  let reconnectTimeout = null;

  function schedulePing () {
    BackgroundTimer.stopBackgroundTimer();
    console.log('schedulePing');

    // ping every 1 minute to keep connection alive
    BackgroundTimer.runBackgroundTimer(() => {
      webSocket.ping();
      console.log('ping');
    }, 60000);
  }

  function scheduleRconnect () {
    console.log('scheduleRconnect');
    clearTimeout(reconnectTimeout);

    reconnectTimeout = setTimeout(() => {
      connect();
    }, 1000);
  }

  function restartConnection () {
    clearTimeout(reconnectTimeout);
    BackgroundTimer.stopBackgroundTimer();
    scheduleRconnect();
  }

  function connect () {
    console.log('connecting');

    clearTimeout(reconnectTimeout);
    BackgroundTimer.stopBackgroundTimer();

    webSocket = null;
    webSocket = createConnection();

    webSocket.onopen = schedulePing;
    webSocket.onclose = restartConnection;

    webSocket.onmessage = async ({ data }) => {
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
    console.log('unmounted');
  };
}
