import { fetch as checkInternet } from '@react-native-community/netinfo';
import iid from '@react-native-firebase/iid';
import { initializeStore, store, updateStore } from 'fluxible-js';
import { getFirstInstallTime } from 'react-native-device-info';
import RNSInfo from 'react-native-sensitive-info';
import { STAGE } from 'env';
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
    relogin: false,
    authUser: null,
    authToken: null,
    initComplete: false,
    deviceToken: null,
    toasts: [],
    sendingContactRequests: [],
    refreshMyContactList: false
  };
}

const options = {
  sharedPreferencesName: `com.entrepic.${STAGE}.secured-data`,
  keychainService: `com.entrepic.${STAGE}.secured-data`
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
  const [deviceToken, firstInstallTime] = await Promise.all([
    iid().getToken(),
    getFirstInstallTime()
  ]);

  if (
    !store.lastStoreInit ||
    firstInstallTime > store.lastStoreInit ||
    !store.authToken ||
    !hasCompletedSetup(store.authUser) ||
    !store.authUser.emailVerifiedAt
  ) {
    updateStore({
      ...getInitialStore(),
      initComplete: true,
      deviceToken,
      lastStoreInit: Date.now()
    });

    return;
  }

  if (!(await hasInternet())) {
    updateStore({
      deviceToken,
      initComplete: true,
      lastStoreInit: Date.now()
    });

    return;
  }

  try {
    const response = await xhr('/validate-auth', {
      method: 'post',
      deviceToken
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
      reAuth: true,
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
