import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { Provider } from 'react-redux';

import AppsNavigator from './navigation/AppNavigation';
import store from './redux/store';

export default function App() {
  return (
    <Provider store={store}>
    <AppsNavigator />
    </Provider>
  );
}

const styles = StyleSheet.create({
});
