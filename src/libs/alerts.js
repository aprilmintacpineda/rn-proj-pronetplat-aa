import { Alert } from 'react-native';

export function unknownError () {
  Alert.alert('Error', 'An unknown error occured, please try again.');
}
