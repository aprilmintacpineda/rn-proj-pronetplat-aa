import AsyncStorage from '@react-native-async-storage/async-storage';
import Reactotron from 'reactotron-react-native';

Reactotron.setAsyncStorageHandler(AsyncStorage)
  .configure({
    host: '192.168.1.5'
  })
  .useReactNative()
  .connect();
