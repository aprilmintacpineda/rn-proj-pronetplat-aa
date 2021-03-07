import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetch as checkInternet } from '@react-native-community/netinfo';
import iid from '@react-native-firebase/iid';
import { initializeStore, store, updateStore } from 'fluxible-js';
import RNSInfo from 'react-native-sensitive-info';
import { STAGE } from 'env';
import { logLogin } from 'libs/logging';
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
    deviceToken: null,
    toasts: [],
    sendingContactRequests: []
  };
}

const options = {
  sharedPreferencesName: `com.entrepconnect.${STAGE}.secured-data`,
  keychainService: `com.entrepconnect.${STAGE}.secured-data`
};

const asyncStorage = {
  setItem: (key, value) => RNSInfo.setItem(key, value, options),
  getItem: async key => {
    const hasRunBefore = await AsyncStorage.getItem('hasRunBefore');

    if (!hasRunBefore) {
      await Promise.all([
        AsyncStorage.setItem('hasRunBefore', 'true'),
        RNSInfo.deleteItem(key, options)
      ]);

      return null;
    }

    return RNSInfo.getItem(key, options);
  }
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
    updateStore({ deviceToken: await iid().getToken() });

    if (!store.authToken || !(await hasInternet())) {
      updateStore({ initComplete: true });
      return;
    }

    if (
      !hasCompletedSetup(store.authUser) ||
      !store.authUser.emailVerifiedAt
    )
      throw new Error('User has not complete setup');

    const response = await xhr('/validate-auth', { method: 'post' });
    const { userData, authToken } = await response.json();

    logLogin('verifyAuth');

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
