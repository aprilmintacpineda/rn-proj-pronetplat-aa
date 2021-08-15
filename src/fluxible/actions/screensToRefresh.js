import { store, updateStore } from 'fluxible-js';

export function refreshScreen (screenName) {
  if (!store.screensToRefresh.includes(screenName)) {
    updateStore({
      screensToRefresh: store.screensToRefresh.concat(screenName)
    });
  }
}
