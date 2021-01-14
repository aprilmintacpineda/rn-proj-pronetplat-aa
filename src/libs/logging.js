import analytics from '@react-native-firebase/analytics';
import crashlytics from '@react-native-firebase/crashlytics';
import iid from '@react-native-firebase/iid';
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
  const token = await iid().getToken();

  await Promise.all([
    crashlytics().setUserId(token),
    analytics().setUserId(token)
  ]);

  crashlytics().log('App mounted');
  await analytics().logAppOpen();
}

export async function logEvent ({ eventName, params }) {
  const currentRouteName = getCurrentRoute();
  crashlytics().log(
    `Event ${eventName} on route ${currentRouteName}`
  );

  await analytics().logEvent(eventName, {
    currentRouteName,
    ...params
  });
}

export async function logLogin () {
  crashlytics().log('User logged in');
  await analytics().logLogin({ method: 'embedded' });
}

export async function logLogout () {
  crashlytics().log('User logged out');
  await analytics().logEvent('logout');
}
