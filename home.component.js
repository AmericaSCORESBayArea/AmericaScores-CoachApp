import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {  BottomNavigationTab, BottomNavigation, Icon, Button, TopNavigationAction, OverflowMenu, MenuItem } from "@ui-kitten/components";
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

const Stack_Activities = createStackNavigator();
const Stack_Activities_Navigation = ({navigation}) => (
    <Stack_Activities.Navigator>
        <Stack_Activities.Screen options={headerOptions} name='Activities' component={ActivitiesScreen} navigation={navigation}/>
        <Stack_Activities.Screen options={headerOptions} name="Attendance" component={AttendanceScreen} />
        <Stack_Activities.Screen options={headerOptions} name="Scan students QR" component={QRScanScreen}/>
    </Stack_Activities.Navigator>
);

const Stack_Teams = createStackNavigator();
const Stack_Teams_Navigation = ({navigation}) => (
    <Stack_Teams.Navigator>
        <Stack_Teams.Screen name="Teams" component={TeamsScreen} options={headerOptions} navigation={navigation} />
        <Stack_Teams.Screen name='Activities' component={ActivitiesScreen} options={headerOptions} navigation={navigation}/>
        <Stack_Teams.Screen name="Attendance" component={AttendanceScreen} options={headerOptions} />
        <Stack_Teams.Screen name="Scan students QR" component={QRScanScreen} options={headerOptions}/>
    </Stack_Teams.Navigator>
);

const Stack_Students = createStackNavigator();
const Stack_Students_Navigation = ({navigation}) => (
    <Stack_Students.Navigator>
        <Stack_Students.Screen name="Students" component={StudentsScreen} options={headerOptions}/>
    </Stack_Students.Navigator>
);

const { Navigator, Screen } = createBottomTabNavigator();
const TabNavigator = ({navigation}) => (
    <Navigator tabBar={props => <BottomTabBar {...props} /> } >
        <Screen name="ActivitiesStack" component={Stack_Activities_Navigation} />
        <Screen name='TeamsStack' component={Stack_Teams_Navigation}/>
        <Screen name='StudentsScreen' component={Stack_Students_Navigation}/>
    </Navigator>
  );

export const HomeScreen = ({navigation}) => {
    return(
        <SafeAreaView  style={{flex: 1, backgroundColor:'white'}} edges={['right', 'bottom', 'left']} >
            <TabNavigator navigation={navigation}/>
        </SafeAreaView>
    );
}

const OptionOverflowMenu = (navigation) => {
    const [visoverflowMenuVisibleble, setOverflowMenuVisible] = React.useState(false);
    const [nameValue, setNameValue] = React.useState();
    
    const OptionsIcon = (props) => ( <Icon {...props} name='more-vertical-outline' /> );
    const addStudentToSchoolIcon = (props) => (<Icon {...props} name="person-add-outline"/>);
    const addStudentIcon = (props) => (<Icon {...props} name="plus-outline"/>);
    const logoutIcon = (props) => (<Icon {...props} name="log-out-outline"/>);
    const OptionButtons = () => (
        <Button style={{flex:1}} accessoryRight={OptionsIcon} onPress={() => setOverflowMenuVisible(true)}/>
    );

    function menuItemOnPress(modalScreen) {
        setOverflowMenuVisible(false);
        navigation.navigate(modalScreen);
    };

    return (
        <OverflowMenu
        anchor={OptionButtons}
        visible={visoverflowMenuVisibleble} 
        placement={"bottom"} 
        onBackdropPress={() => setOverflowMenuVisible(false)}>
            <MenuItem title='Create Student' onPress={() => menuItemOnPress("CreateStudentModal")} accessoryLeft={addStudentIcon}/>
            <MenuItem title='Add student to team' onPress={() => menuItemOnPress("AddStudentToTeamModal")} accessoryLeft={addStudentToSchoolIcon}/>
            <MenuItem title="Log out" accessoryLeft={logoutIcon}/>
        </OverflowMenu>
    );  
};  

//this.menuItemOnPress("AddStudentToTeamModal")
const headerOptions =
    ({navigation}) => ({
        headerStyle: {
          backgroundColor: '#336AFF',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerRight: () => <OptionOverflowMenu {...navigation}/>
    })
