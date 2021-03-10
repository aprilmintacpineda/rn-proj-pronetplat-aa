import { store, updateStore } from 'fluxible-js';
import { getInitialStore, restore } from 'fluxible/store/init';
import { logLogin, logLogout } from 'libs/logging';
import { xhr } from 'libs/xhr';

export function login ({ userData, authToken }) {
  logLogin();
  updateStore({ authUser: userData, authToken });
}

export function logout () {
  logLogout();
  xhr('/logout', { method: 'post' });
  updateStore(restore(getInitialStore()));
}

export function decrementContactRequestsCount () {
  updateStore({
    authUser: {
      ...store.authUser,
      receivedContactRequestsCount: Math.max(
        0,
        store.authUser.receivedContactRequestsCount - 1
      )
    }
  });
}

export function incrementContactRequestsCount () {
  updateStore({
    authUser: {
      ...store.authUser,
      receivedContactRequestsCount:
        store.authUser.receivedContactRequestsCount + 1
    }
  });
}

export function incrementNotificationsCount () {
  updateStore({
    authUser: {
      ...store.authUser,
      notificationsCount: store.authUser.notificationsCount + 1
    }
  });
}

export function resetNotificationsCount () {
  if (store.authUser.notificationsCount) {
    updateStore({
      authUser: {
        ...store.authUser,
        notificationsCount: 0
      }
    });
  }
}
