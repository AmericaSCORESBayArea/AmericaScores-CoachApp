import React from 'react';
import {Image} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaView } from "react-native-safe-area-context";
import { TopNavigation, BottomNavigationTab, BottomNavigation, Icon, TopNavigationAction, Divider } from "@ui-kitten/components";
import SchoolsScreen from "./src/SchoolsScreen.component";
import TodayScreen from "./src/TodayScreen.component";
import AttendanceScreen from "./src/AttendanceScreen.component";
import { createStackNavigator } from '@react-navigation/stack';

const SchoolIcon = (props) => ( <Icon {...props} name='home-outline'/> );
const TodayIcon = (props) => ( <Icon {...props} name='calendar-outline'/> );
  
const BottomTabBar = ({ navigation, state }) => (
    <BottomNavigation 
        selectedIndex={state.index} 
        onSelect={index => navigation.navigate(state.routeNames[index])} >
        <BottomNavigationTab title='Today' icon={TodayIcon}/>
        <BottomNavigationTab title='Schools' icon={SchoolIcon}/>
    </BottomNavigation>
);

const StackTodayNavigator = createStackNavigator();
const StackTodayScreen = ({navigation}) => (
    <StackTodayNavigator.Navigator headerMode="none">
        <StackTodayNavigator.Screen name='Today' component={TodayScreen} navigation={navigation}/>
        <StackTodayNavigator.Screen name="Attendance" component={AttendanceScreen} />
    </StackTodayNavigator.Navigator>
);

const { Navigator, Screen } = createBottomTabNavigator();
const TabNavigator = ({navigation}) => (
    <Navigator  tabBar={props => <BottomTabBar {...props} /> }>
        <Screen name="TodayStack" component={StackTodayScreen} options={({route}) => ({ tittle: "Today activities"})}/>
        <Screen name='SchoolsStack' component={SchoolsScreen} options={({route})=> ({ tittle: "Schools Seasons"})}/>
    </Navigator>
  );

export const HomeScreen = ({navigation}) => {
    return(
        <SafeAreaView style={{flex: 1}}>
            <TabNavigator navigation={navigation}/>
        </SafeAreaView>
    );
}
// <TopBarNavigation navigation={navigation}/>
//
/* 
    - Create new student
    - Add student existense to class
*/