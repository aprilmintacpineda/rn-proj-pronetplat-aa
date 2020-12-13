import { updateStore } from 'fluxible-js';

export function login ({ authUser, authToken }) {
  updateStore({ authUser, authToken });
}

export function logout () {
  updateStore({
    authToken: null,
    authUser: null
  });
}
