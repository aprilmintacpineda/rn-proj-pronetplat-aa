import { store, updateStore } from 'fluxible-js';
import { logLogin, logLogout } from 'libs/logging';
import { xhr } from 'libs/xhr';

export function login ({ userData, authToken }) {
  logLogin();
  updateStore({ authUser: userData, authToken });
}

export function reAuth ({ userData, authToken }) {
  logLogin('reAuth');

  if (store.authUser.id !== userData.id) {
    updateStore({
      authUser: userData,
      authToken,
      sendingContactRequests: []
    });
  } else {
    updateStore({
      authUser: userData,
      authToken
    });
  }
}

export function logout () {
  logLogout();

  xhr('/logout', {
    method: 'post',
    authToken: store.authToken
  });

  updateStore({
    authUser: null,
    authToken: null,
    sendingContactRequests: []
  });
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

export function incrementEventInvitationsCount () {
  updateStore({
    authUser: {
      ...store.authUser,
      eventInvitationsCount: store.authUser.eventInvitationsCount + 1
    }
  });
}

export function decrementEventInvitationsCount () {
  updateStore({
    authUser: {
      ...store.authUser,
      eventInvitationsCount: Math.max(
        store.authUser.eventInvitationsCount - 1,
        0
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
