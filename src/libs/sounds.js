import { Platform } from 'react-native';
import Sound from 'react-native-sound';

const mainBundle =
  Platform.OS === 'ios'
    ? encodeURIComponent(Sound.MAIN_BUNDLE)
    : Sound.MAIN_BUNDLE;

export const notifAlert = new Sound(
  'notif_alert.mp3',
  mainBundle,
  error => {
    if (error) console.error(error);
  }
);
