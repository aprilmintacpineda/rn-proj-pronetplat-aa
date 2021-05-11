import { store } from 'fluxible-js';

let webSocket = null;
let messageId = 0;
const socketListeners = {};

export function sendChatMessage ({ recipientId, messageBody }) {
  return new Promise((resolve, reject) => {
    messageId++;

    webSocket.send(
      JSON.stringify({
        action: 'sendmessage',
        data: {
          action: 'sendChatMessage',
          recipientId,
          messageBody,
          messageId
        }
      })
    );

    const timer = setTimeout(() => {
      reject();
    }, 30000);

    socketListeners[messageId] = payload => {
      clearTimeout(timer);
      resolve(payload);
    };
  });
}

function createConnection () {
  return new WebSocket(
    'wss://9ij2l2b278.execute-api.ap-southeast-1.amazonaws.com/dev',
    undefined,
    {
      headers: {
        Authorization: `Bearer ${store.authToken}`
      }
    }
  );
}

export function initConnection () {
  let unmounted = false;
  let reconnectTimeout = null;

  webSocket = createConnection();

  webSocket.onerror = () => {
    if (!unmounted) {
      clearTimeout(reconnectTimeout);

      reconnectTimeout = setTimeout(() => {
        webSocket = createConnection();
      }, 3000);
    }
  };

  webSocket.onclose = () => {
    if (!unmounted) {
      clearTimeout(reconnectTimeout);

      reconnectTimeout = setTimeout(() => {
        webSocket = createConnection();
      }, 3000);
    }
  };

  webSocket.onmessage = ({ data }) => {
    const { payload, messageId } = JSON.parse(data);
    const callback = socketListeners[messageId];
    if (callback) callback(payload);
  };

  return () => {
    unmounted = true;
    clearTimeout(reconnectTimeout);
    webSocket.close();
  };
}
