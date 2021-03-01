import analytics from '@react-native-firebase/analytics';
import crashlytics from '@react-native-firebase/crashlytics';
import { navigationRef } from 'App';

function getCurrentRoute () {
  let currentRoute = 'unknown';

  try {
    currentRoute = navigationRef.current.getCurrentRoute().name;
  } catch (error) {
    console.log(error);
  }

  return currentRoute;
}

export async function logScreenView () {
  const currentRouteName = getCurrentRoute();
  crashlytics().log(`Navigated to ${currentRouteName}`);

  await analytics().logScreenView({
    screen_name: currentRouteName,
    screen_class: currentRouteName
  });
}

export async function appMounted () {
  crashlytics().log('App mounted');
  await analytics().logAppOpen();
}

export async function logEvent (eventName, params) {
  const currentRouteName = getCurrentRoute();

  crashlytics().log(
    `Event ${eventName} on route ${currentRouteName}`
  );

  await analytics().logEvent(eventName, {
    currentRouteName,
    ...params
  });
}

export async function logLogin (method = 'form') {
  crashlytics().log('User logged in');
  await analytics().logLogin({ method });
}

export async function logRegister () {
  crashlytics().log('User registered in');
  await analytics().logSignUp({ method: 'embedded' });
}

export async function logLogout () {
  crashlytics().log('User logged out');
  await analytics().logEvent('logout');
}
