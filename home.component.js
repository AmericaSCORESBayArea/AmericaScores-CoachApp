import React from 'react';
import {Image} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaView } from "react-native-safe-area-context";
import { TopNavigation, BottomNavigationTab, BottomNavigation, Icon, TopNavigationAction, Divider } from "@ui-kitten/components";
import SchoolsScreen from "./src/SchoolsScreen.component";
import ActivitiesScreen from "./src/TodayScreen.component";
import AttendanceScreen from "./src/AttendanceScreen.component";
import QRScanScreen from "./src/QRScan.Screen.component";
import { createStackNavigator } from '@react-navigation/stack';
import StudentsScreen from "./src/StudentsScreen.component";

const SchoolIcon = (props) => ( <Icon {...props} name='home-outline'/> );
const TodayIcon = (props) => ( <Icon {...props} name='calendar-outline'/> );
const StudentsIcon = (props) => ( <Icon {...props} name='people-outline'/> );

const BottomTabBar = ({ navigation, state }) => (
    <BottomNavigation 
        selectedIndex={state.index} 
        onSelect={index => navigation.navigate(state.routeNames[index])} >
        <BottomNavigationTab title='Activities' icon={TodayIcon}/>
        <BottomNavigationTab title='Teams' icon={SchoolIcon}/>
        <BottomNavigationTab title='Students' icon={StudentsIcon}/>
    </BottomNavigation>
);

const StackActivitiesView = createStackNavigator();
const StackActivitiesViewScreen = ({navigation}) => (
    <StackActivitiesView.Navigator headerMode="none">
        <StackActivitiesView.Screen name='ActivitiesTabView' component={ActivitiesScreen} navigation={navigation}/>
        <StackActivitiesView.Screen name="Attendance" component={AttendanceScreen} />
        <StackActivitiesView.Screen name="QRScreen" component={QRScanScreen}/>
    </StackActivitiesView.Navigator>
);

const StackTeamsView = createStackNavigator();
const StackTeamsViewScreen = ({navigation}) => (
    <StackTeamsView.Navigator headerMode="none">
        <StackTeamsView.Screen name="Teams" component={SchoolsScreen} navigation={navigation} />
        <StackTeamsView.Screen name='Activities' component={ActivitiesScreen} navigation={navigation}/>
        <StackTeamsView.Screen name="Attendance" component={AttendanceScreen} />
        <StackTeamsView.Screen name="QRScreen" component={QRScanScreen}/>
    </StackTeamsView.Navigator>
);

const { Navigator, Screen } = createBottomTabNavigator();
const TabNavigator = ({navigation}) => (
    <Navigator  tabBar={props => <BottomTabBar {...props} /> }>
        <Screen name="ActivitiesViewStack" component={StackActivitiesViewScreen} options={({route}) => ({ tittle: "Today activities"})}/>
        <Screen name='TeamsStack' component={StackTeamsViewScreen} options={({route})=> ({ tittle: "Teams Seasons"})}/>
        <Screen name='StudentsScreen' component={StudentsScreen}/>
    </Navigator>
  );

export const HomeScreen = ({navigation}) => {
    return(
        <SafeAreaView style={{flex: 1}}>
            <TabNavigator navigation={navigation}/>
        </SafeAreaView>
    );
}