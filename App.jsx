/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {LogBox, StatusBar} from 'react-native';
import {Provider} from 'react-redux';

//Components
import AppLayout from './src/AppLayout';
import store from './src/redux/store';
import FlashMessage from 'react-native-flash-message';
import clearAppDataOnFirstInstall from './src/hooks/clearStorageOnFirstInstall';

const App = () => {
  LogBox.ignoreAllLogs();

  React.useEffect(() => {
    clearAppDataOnFirstInstall();
  }, []);

  return (
    <Provider store={store}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <AppLayout />
      <FlashMessage position={'top'} />
    </Provider>
  );
};

export default App;
