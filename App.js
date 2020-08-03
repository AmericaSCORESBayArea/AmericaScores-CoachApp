import React from 'react';
import * as eva from '@eva-design/eva';
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import AppNavigator from './src/AppNavigator.Screen';
import * as AppAuth from 'expo-app-auth';
import { Provider } from 'react-redux';

import { default as theme } from './assets/ASBA_Theme_Light_v1.json'; // <-- Import app theme

import configureStore from './src/config/ConfigureStore';

// When configured correctly, URLSchemes should contain your REVERSED_CLIENT_ID
const { URLSchemes } = AppAuth;
const store = configureStore()

export default function App() {

  return (
    <>
        <IconRegistry icons={EvaIconsPack}/>
        <ApplicationProvider store={configureStore} {...eva} theme={{...eva.light, ...theme}}>
          <Provider store={store}>
            <AppNavigator/>
          </Provider>    
        </ApplicationProvider>
    </>
  );
}
