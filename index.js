if (__DEV__) require('./ReactotronConfig');

import 'react-native-gesture-handler';
import { AppRegistry } from 'react-native';
import { name as appName } from './app.json';
import Main from 'Main';

AppRegistry.registerComponent(appName, () => Main);
