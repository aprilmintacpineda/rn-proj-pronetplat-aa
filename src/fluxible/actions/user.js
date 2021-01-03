import { updateStore } from 'fluxible-js';
import { getInitialStore, restore } from 'fluxible/store/init';
import { logLogin, logLogout } from 'libs/logging';

export function login ({ authUser, authToken }) {
  updateStore({ authUser, authToken });
  logLogin();
}

export function logout () {
  updateStore({
    ...restore(getInitialStore()),
    contactRequestNum: 0,
    notificationsNum: 0
  });

  logLogout();
}
