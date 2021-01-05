import { initializeStore, updateStore } from 'fluxible-js';
import RNSInfo from 'react-native-sensitive-info';
import { STAGE } from 'env';

export function getInitialStore () {
  return {
    popup: {
      shown: false,
      body: null
    },
    authUser: null,
    authToken: null,
    initComplete: false,
    pendingContactRequests: [],
    receivedContactRequestCount: 0,
    notificationsCount: 0
  };
}

const options = {
  sharedPreferencesName: `com.quaint.${STAGE}.secured-data`,
  keychainService: `com.quaint.${STAGE}.secured-data`
};

const asyncStorage = {
  setItem: (key, value) => RNSInfo.setItem(key, value, options),
  getItem: key => RNSInfo.getItem(key, options)
};

export function restore ({ authUser, authToken, pendingContactRequests }) {
  return { authUser, authToken, pendingContactRequests };
}

function onInitComplete () {
  updateStore({ initComplete: true });
}

export function initStore () {
  const config = {
    initialStore: getInitialStore(),
    persist: {
      asyncStorage,
      restore
    }
  };

  initializeStore(config, onInitComplete);
}
