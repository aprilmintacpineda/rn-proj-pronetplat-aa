import analytics from '@react-native-firebase/analytics';
import crashlytics from '@react-native-firebase/crashlytics';
import messaging from '@react-native-firebase/messaging';
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
  try {
    const currentRouteName = getCurrentRoute();
    crashlytics().log(`Navigated to ${currentRouteName}`);

    await analytics().logScreenView({
      screen_name: currentRouteName,
      screen_class: currentRouteName
    });
  } catch (error) {
    console.log(error);
  }
}

export async function appMounted () {
  try {
    const token = await messaging().getToken();

    await Promise.all([
      crashlytics().setUserId(token),
      analytics().setUserId(token)
    ]);

    crashlytics().log('App mounted');
    await analytics().logAppOpen();
  } catch (error) {
    console.log(error);
  }
}

export async function logEvent (eventName, params) {
  try {
    const currentRouteName = getCurrentRoute();

    crashlytics().log(
      `Event ${eventName} on route ${currentRouteName}`
    );

    await analytics().logEvent(eventName, {
      currentRouteName,
      ...params
    });
  } catch (error) {
    console.log(error);
  }
}

export async function logLogin (method = 'login') {
  try {
    crashlytics().log('User logged in');
    await analytics().logLogin({ method });
  } catch (error) {
    console.log(error);
  }
}

export async function logRegister () {
  try {
    crashlytics().log('User registered in');
    await analytics().logSignUp({ method: 'embedded' });
  } catch (error) {
    console.log(error);
  }
}

export async function logLogout () {
  try {
    crashlytics().log('User logged out');
    await analytics().logEvent('logout');
  } catch (error) {
    console.log(error);
  }
}
