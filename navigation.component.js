import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { LogInScreen } from './login.component';
import { HomeScreen } from './home.component';
import { CreateStudentModal, AddStudentToTeamModal } from './src/components/StudentModal.component';

const { Navigator, Screen } = createStackNavigator();

const HomeRootStack = createStackNavigator();
const HomeRootStackScreen = () => {
  return(
    <HomeRootStack.Navigator headerMode="none" mode="modal" screenOptions={{
      headerShown: false,
      cardStyle: { backgroundColor: 'transparent' },
      cardOverlayEnabled: true,
      cardStyleInterpolator: ({ current: { progress } }) => ({
        cardStyle: {
          opacity: progress.interpolate({ inputRange: [0, 0.5, 0.9, 1], outputRange: [0, 0.25, 0.7, 1] }),
        },
        overlayStyle: {
          opacity: progress.interpolate({ inputRange: [0, 1], outputRange: [0, 0.5], extrapolate: 'clamp' }),
        },
      }),
    }}>
      <HomeRootStack.Screen name='Home' component={HomeScreen}/>
      <HomeRootStack.Screen name="CreateStudentModal" component={CreateStudentModal}/>
      <HomeRootStack.Screen name="AddStudentToTeamModal" component={AddStudentToTeamModal}/>
    </HomeRootStack.Navigator>
  );
}

const HomeNavigator = () => (
    <Navigator headerMode='none'>
      <Screen name='Login' component={LogInScreen}/>
      <Screen name="HomeRoot" component={HomeRootStackScreen}/>
    </Navigator>
);

export const AppNavigator = () => (
    <NavigationContainer>
      <HomeNavigator />
    </NavigationContainer>  
);