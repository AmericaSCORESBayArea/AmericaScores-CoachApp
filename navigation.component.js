import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { LogInScreen } from './login.component';
import { HomeScreen } from './home.component';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const { Navigator, Screen } = createStackNavigator();

const HomeNavigator = () => (
    <Navigator headerMode='none'>
        <Screen name='Login' component={LogInScreen}/>
        <Screen name='Home' component={HomeScreen}/>
    </Navigator>
);

export const AppNavigator = () => (
  <SafeAreaProvider>
    <NavigationContainer>
      <HomeNavigator />
    </NavigationContainer>
  </SafeAreaProvider>
);