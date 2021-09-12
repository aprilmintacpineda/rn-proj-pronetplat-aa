import { fetch as checkInternet } from '@react-native-community/netinfo';
import { initializeStore, store, updateStore } from 'fluxible-js';
import config from 'react-native-config';
import { getFirstInstallTime } from 'react-native-device-info';
import RNSInfo from 'react-native-sensitive-info';
import { logEvent, logLogin } from 'libs/logging';
import { hasCompletedSetup } from 'libs/user';
import { xhr } from 'libs/xhr';

async function hasInternet () {
  const { isConnected } = await checkInternet();
  return isConnected;
}

export function getInitialStore () {
  return {
    popup: {
      shown: false,
      body: null
    },
    authUser: null,
    authToken: null,
    initComplete: false,
    toasts: [],
    sendingContactRequests: [],
    screensToRefresh: []
  };
}

const options = {
  sharedPreferencesName: `com.entrepic.${config.STAGE}.secured-data`,
  keychainService: `com.entrepic.${config.STAGE}.secured-data`
};

const asyncStorage = {
  setItem: (key, value) => RNSInfo.setItem(key, value, options),
  getItem: async key => RNSInfo.getItem(key, options)
};

export function restore ({
  authUser,
  authToken,
  sendingContactRequests,
  lastStoreInit
}) {
  return {
    authUser,
    authToken,
    sendingContactRequests,
    lastStoreInit
  };
}

async function onInitComplete () {
  const firstInstallTime = await getFirstInstallTime();

  if (
    !store.lastStoreInit ||
    firstInstallTime > store.lastStoreInit ||
    !store.authToken ||
    !store.authUser ||
    !hasCompletedSetup(store.authUser) ||
    !store.authUser.emailVerifiedAt
  ) {
    updateStore({
      ...getInitialStore(),
      initComplete: true,
      lastStoreInit: Date.now()
    });

    return;
  }

  if (!(await hasInternet())) {
    updateStore({
      initComplete: true,
      lastStoreInit: Date.now()
    });

    return;
  }

  try {
    const response = await xhr('/validate-auth', {
      method: 'post'
    });

    const { userData, authToken } = await response.json();

    logLogin('verifyAuth');

    updateStore({
      initComplete: true,
      authUser: userData,
      authToken,
      lastStoreInit: Date.now()
    });
  } catch (error) {
    console.log(error);

    updateStore({
      initComplete: true,
      authUser: null,
      authToken: null,
      sendingContactRequests: [],
      lastStoreInit: Date.now()
    });

    logEvent('validateAuthError', {
      message: error.message
    });
  }
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
