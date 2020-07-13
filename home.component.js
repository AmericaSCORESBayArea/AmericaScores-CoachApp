import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {  BottomNavigationTab, BottomNavigation, Icon } from "@ui-kitten/components";
import TeamsScreen from "./src/TeamsScreen.component";
import ActivitiesScreen from "./src/ActivitiesScreen.component";
import AttendanceScreen from "./src/AttendanceScreen.component";
import QRScanScreen from "./src/QRScan.Screen.component";
import { createStackNavigator } from '@react-navigation/stack';
import StudentsScreen from "./src/StudentsScreen.component";

import {SafeAreaView} from 'react-native-safe-area-context';

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
    <StackActivitiesView.Navigator>
        <StackActivitiesView.Screen options={headerOptions} name='Activities' component={ActivitiesScreen} navigation={navigation}/>
        <StackActivitiesView.Screen options={headerOptions} name="Attendance" component={AttendanceScreen} />
        <StackActivitiesView.Screen options={headerOptions} name="Scan students" component={QRScanScreen}/>
    </StackActivitiesView.Navigator>
);

const StackTeamsView = createStackNavigator();
const StackTeamsViewScreen = ({navigation}) => (
    <StackTeamsView.Navigator>
        <StackTeamsView.Screen name="Teams" component={TeamsScreen} options={headerOptions} navigation={navigation} />
        <StackTeamsView.Screen name='Activities' component={ActivitiesScreen} options={headerOptions} navigation={navigation}/>
        <StackTeamsView.Screen name="Attendance" component={AttendanceScreen} options={headerOptions} />
        <StackTeamsView.Screen name="QRScreen" component={QRScanScreen} options={headerOptions}/>
    </StackTeamsView.Navigator>
);

const StackStudentsView = createStackNavigator();
const StackStudentsScreen = ({navigation}) => (
    <StackStudentsView.Navigator>
        <StackTeamsView.Screen name="Students" component={StudentsScreen} options={headerOptions}/>
    </StackStudentsView.Navigator>
);

const { Navigator, Screen } = createBottomTabNavigator();
const TabNavigator = ({navigation}) => (
    <Navigator tabBar={props => <BottomTabBar {...props} /> } >
        <Screen name="ActivitiesViewStack" component={StackActivitiesViewScreen} />
        <Screen name='TeamsStack' component={StackTeamsViewScreen} options={({route})=> ({ tittle: "Teams Seasons"})}/>
        <Screen name='StudentsScreen' component={StackStudentsScreen}/>
    </Navigator>
  );

export const HomeScreen = ({navigation}) => {
    return(
        <SafeAreaView  style={{flex: 1, backgroundColor:'white'}} edges={['right', 'bottom', 'left']} >
            <TabNavigator navigation={navigation}/>
        </SafeAreaView>
    );
}

const headerOptions = {
    headerStyle: {
      backgroundColor: '#284de0',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
}