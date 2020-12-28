import analytics from '@react-native-firebase/analytics';
import crashlytics from '@react-native-firebase/crashlytics';
import { navigationRef } from 'App';

export async function logScreenView () {
  const currentRouteName = navigationRef.current.getCurrentRoute().name;

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

export async function logEvent ({ eventName, params }) {
  const currentRouteName = navigationRef.current.getCurrentRoute().name;

  crashlytics().log(`Event ${eventName} on route ${currentRouteName}`);

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
