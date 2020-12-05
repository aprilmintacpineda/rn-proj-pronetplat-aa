import { Platform, TouchableOpacity } from 'react-native';
import { TouchableRipple } from 'react-native-paper';

export default Platform.select({
  ios: TouchableOpacity,
  android: TouchableRipple
});
