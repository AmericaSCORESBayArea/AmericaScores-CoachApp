import React from 'react';
import * as eva from '@eva-design/eva';
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { AppNavigator } from './navigation.component';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
  return (
    <>
        <IconRegistry icons={EvaIconsPack}/>
        <ApplicationProvider {...eva} theme={eva.light}>
          <SafeAreaProvider>
            <AppNavigator/>
          </SafeAreaProvider>
        </ApplicationProvider>
    </>
  );
}
