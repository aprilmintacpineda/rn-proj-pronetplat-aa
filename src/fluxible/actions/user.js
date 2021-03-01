import { updateStore } from 'fluxible-js';
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
