import { fetch as checkInternet } from '@react-native-community/netinfo';
import iid from '@react-native-firebase/iid';
import { initializeStore, store, updateStore } from 'fluxible-js';
import RNSInfo from 'react-native-sensitive-info';
import { STAGE } from 'env';
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
    receivedContactRequestCount: 0,
    notificationsCount: 0,
    isOpenLoadingOverlay: false
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

export function restore ({
  authUser,
  authToken,
  sendingContactRequests
}) {
  return { authUser, authToken, sendingContactRequests };
}

async function onInitComplete () {
  try {
    if (!store.authToken || !(await hasInternet())) {
      updateStore({ initComplete: true });
      return;
    }

    const deviceToken = await iid().getToken();

    const response = await xhr('/validate-auth', {
      method: 'post',
      body: { deviceToken }
    });

    const { userData, authToken } = await response.json();

    updateStore({
      initComplete: true,
      authUser: userData,
      authToken
    });
  } catch (error) {
    console.log(error);

    updateStore({
      initComplete: true,
      authUser: null,
      authToken: null
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
