import { updateStore } from 'fluxible-js';
import { getInitialStore, restore } from 'fluxible/store/init';
import { logLogin, logLogout } from 'libs/logging';
import { xhr } from 'libs/xhr';

export function login ({ userData, authToken }) {
  updateStore({ authUser: userData, authToken });
  logLogin();
}

export function logout () {
  xhr('/logout', { method: 'post' });
  updateStore(restore(getInitialStore()));
  logLogout();
}
