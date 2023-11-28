/**
 * @format
 */
import 'react-native-gesture-handler';
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import './src/languages/i18n';
import notifee from '@notifee/react-native';

notifee.registerForegroundService(notification => {
    return new Promise(() => {

    });
});

AppRegistry.registerComponent(appName, () => App);
