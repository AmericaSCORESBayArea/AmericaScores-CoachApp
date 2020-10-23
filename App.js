import React, { useEffect , useState} from 'react';
import * as eva from '@eva-design/eva';
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import AppNavigator from './src/AppNavigator.Screen';
import * as AppAuth from 'expo-app-auth';
import { Provider } from 'react-redux';
import auth from '@react-native-firebase/auth';
import { default as theme } from './assets/ASBA_Theme_Light_v1.json'; // <-- Import app theme
import {ApiConfig} from "./src/config/ApiConfig";

import configureStore from './src/config/ConfigureStore';
import Axios from 'axios';

// When configured correctly, URLSchemes should contain your REVERSED_CLIENT_ID
const { URLSchemes } = AppAuth;
const store = configureStore()

export default function App() {
  Axios.defaults.headers.common['client_id'] = ApiConfig.clientId;
  Axios.defaults.headers.common['client_secret'] = ApiConfig.clientSecret;
  
  const [login, setLogin] = useState(null);

  
  useEffect(() => {
    auth().onAuthStateChanged((user) => {
      console.log(user);
      !user ? setLogin(false) : setLogin(true);
    });
  }, []);
  console.log(login);
  return (
    <>
        <IconRegistry icons={EvaIconsPack}/>
        <ApplicationProvider store={configureStore} {...eva} theme={{...eva.light, ...theme}}>
          <Provider store={store}>
            <AppNavigator islogged = {{login : login}} />
          </Provider>    
        </ApplicationProvider>
    </>
  );
}
