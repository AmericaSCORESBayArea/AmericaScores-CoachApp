import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { LogInScreen_Select_Club } from "./src/components/Select_club.component";
import {
  HomeScreen,
  OptionsOverflowMenu,
  Stack_Profile_Navigation,
} from "./home.component";
import {
  LogInScreen_PhoneAuth_Code,
  LogInScreen_PhoneAuth_Phone,
} from "./src/components/Login.component";
import {
  CreateStudentModal,
  AddStudentToTeamModal,
  StudentInfoModal,
} from "./src/components/StudentModal.component";
import { CreateReportModal } from "./src/components/ReportModal.component";
import LogInScreen_Google from "./src/Auth/LogInMain.Screen";
import {
  EditSessionModal,
  AddSessionModal,
  AddSessionHeadcountModal,
  EditHeadCountSessionModal,
} from "./src/components/SessionModal.component";
import { AssessmentModal } from "./src/components/AssessmentModal.component";
import {
  UserGuideModal,
  UserGuideModalLogin,
} from "./src/components/UserGuideModal.component";

const HomeRootStack = createStackNavigator();
const LoginStack = createStackNavigator();

const headerOptions = ({ navigation }) => ({
  headerStyle: {
    backgroundColor: "#00467F",
  },
  headerShown: true,
  headerTitle: "Select Club",
  headerTintColor: "#fff",
  headerTitleStyle: { fontWeight: "bold" },
  headerBackVisible: false,
  headerLeft: () => <></>,
  headerRight: () => <OptionsOverflowMenu {...navigation} />,
});
export const HomeRootStackScreen = () => {
  return (
    <HomeRootStack.Navigator
      screenOptions={{
        presentation: "modal",
        headerShown: false,
        cardStyle: { backgroundColor: "transparent" },
        cardOverlayEnabled: true,
        cardStyleInterpolator: ({ current: { progress } }) => ({
          cardStyle: {
            opacity: progress.interpolate({
              inputRange: [0, 0.5, 0.9, 1],
              outputRange: [0, 0.25, 0.7, 1],
            }),
          },
          overlayStyle: {
            opacity: progress.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 0.5],
              extrapolate: "clamp",
            }),
          },
        }),
      }}
    >
      <HomeRootStack.Screen name="Home" component={HomeScreen} />
      <HomeRootStack.Screen
        name="CreateStudentModal"
        component={CreateStudentModal}
      />
      <HomeRootStack.Screen
        name="AddStudentToTeamModal"
        component={AddStudentToTeamModal}
      />
      <HomeRootStack.Screen
        name="EditSessionModal"
        component={EditSessionModal}
      />
      <HomeRootStack.Screen
        name="AddSessionModal"
        component={AddSessionModal}
      />
      <HomeRootStack.Screen
        name="AddSessionHeadcountModal"
        component={AddSessionHeadcountModal}
      />
      <HomeRootStack.Screen
        name="EditHeadCountSessionModal"
        component={EditHeadCountSessionModal}
      />
      <HomeRootStack.Screen
        name="CreateReportModal"
        component={CreateReportModal}
      />
      <HomeRootStack.Screen
        name="StudentInfoModal"
        component={StudentInfoModal}
      />
      <HomeRootStack.Screen name="userGuideModal" component={UserGuideModal} />
      <HomeRootStack.Screen
        name="assessmentModal"
        component={AssessmentModal}
      />
    </HomeRootStack.Navigator>
  );
};

export const LoginStackScreen = () => {
  return (
    <LoginStack.Navigator
      screenOptions={{
        headerShown: false,
        presentation: "card",
      }}
    >
      <LoginStack.Screen name="MainLogin" component={LogInScreen_Google} />
      <LoginStack.Screen
        name="PhoneLogin_phone"
        component={LogInScreen_PhoneAuth_Phone}
      />
      <LoginStack.Screen
        name="PhoneLogin_code"
        component={LogInScreen_PhoneAuth_Code}
      />
      <LoginStack.Screen
        name="userGuideModalLogin"
        component={UserGuideModalLogin}
      />
      <LoginStack.Screen
        name="Select_Club"
        component={LogInScreen_Select_Club}
        options={headerOptions}
      />
      <LoginStack.Screen name="userGuideModal" component={UserGuideModal} />
      <LoginStack.Screen name="profile" component={Stack_Profile_Navigation} />
      <LoginStack.Screen
        name="CreateReportModal"
        component={CreateReportModal}
      />
    </LoginStack.Navigator>
  );
};
