import { updateStore } from 'fluxible-js';
import { logLogin, logLogout } from 'libs/logging';

export function login ({ authUser, authToken }) {
  updateStore({ authUser, authToken });
  logLogin();
}

export function logout () {
  updateStore({
    authToken: null,
    authUser: null
  });

  logLogout();
}
