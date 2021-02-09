import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { LogInScreen_PhoneAuth_Code, LogInScreen_PhoneAuth_Phone } from './src/components/login.component';
import { HomeScreen } from './home.component';
import { AddOtherTeamModal} from './src/components/OtherTeamModal.component';
import { CreateStudentModal, AddStudentToTeamModal } from './src/components/StudentModal.component';
import LogInScreen_Google from "./src/Auth/LogInMain.Screen";

const { Navigator, Screen } = createStackNavigator();

const HomeRootStack = createStackNavigator();
export const HomeRootStackScreen = () => {
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
      <HomeRootStack.Screen name="AddOtherTeamModal" component={AddOtherTeamModal}/>
    </HomeRootStack.Navigator>
  );
}

const LoginStack = createStackNavigator();
export const LoginStackScreen = () => {
  return(
    <LoginStack.Navigator headerMode="none" mode="card">
      <LoginStack.Screen name="MainLogin" component={LogInScreen_Google}/>
      <LoginStack.Screen name="PhoneLogin_phone" component={LogInScreen_PhoneAuth_Phone}/>
      <LoginStack.Screen name="PhoneLogin_code" component={LogInScreen_PhoneAuth_Code}/>
    </LoginStack.Navigator>
  );
}
