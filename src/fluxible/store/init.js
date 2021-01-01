import { initializeStore, updateStore } from 'fluxible-js';
import RNSInfo from 'react-native-sensitive-info';

export function getInitialStore () {
  return {
    popup: {
      shown: false,
      body: null
    },
    authUser: null,
    authToken: null,
    initComplete: false,
    pendingConnections: []
  };
}

const options = {
  sharedPreferencesName: 'connectExpressSharePreferences',
  keychainService: 'connectExpressKeychainService'
};

const asyncStorage = {
  setItem: (key, value) => RNSInfo.setItem(key, value, options),
  getItem: key => RNSInfo.getItem(key, options)
};

export function restore ({ authUser, authToken, pendingConnections }) {
  return { authUser, authToken, pendingConnections };
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
