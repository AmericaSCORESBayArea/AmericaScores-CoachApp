import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { LogInScreen_PhoneAuth_Code, LogInScreen_PhoneAuth_Phone} from './src/components/login.component';
import { LogInScreen_Select_Club } from "./src/components/select_club.component";
import { HomeScreen } from './home.component';
import { CreateStudentModal, AddStudentToTeamModal, StudentInfoModal } from './src/components/StudentModal.component';
import { CreateReportModal } from './src/components/ReportModal.component';
import LogInScreen_Google from "./src/Auth/LogInMain.Screen";
import { EditSessionModal, AddSessionModal } from './src/components/SessionModal.component';
import { userGuideModal, userGuideModalLogin} from './src/components/userGuideModal.component';

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
      <HomeRootStack.Screen name="EditSessionModal" component={EditSessionModal}/>
      <HomeRootStack.Screen name="AddSessionModal" component={AddSessionModal}/>
      <HomeRootStack.Screen name="CreateReportModal" component={CreateReportModal}/>
      <HomeRootStack.Screen name="StudentInfoModal" component={StudentInfoModal}/>
      <HomeRootStack.Screen name="userGuideModal" component={userGuideModal} />
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
      <LoginStack.Screen name="userGuideModalLogin" component={userGuideModalLogin} />
      <LoginStack.Screen name="Select_Club" component={LogInScreen_Select_Club}/>
    </LoginStack.Navigator>
  );
}
