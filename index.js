import 'react-native-gesture-handler';
import { AppRegistry } from 'react-native';
import Reactotron, { networking } from 'reactotron-react-native';
import { name as appName } from './app.json';
import Main from 'Main';

Reactotron.configure().use(networking()).connect();

AppRegistry.registerComponent(appName, () => Main);
