import Sound from 'react-native-sound';

export const alertSound = new Sound('alert.mp3', Sound.MAIN_BUNDLE, error => {
  console.log('failed to preload alertSound', error);
});
