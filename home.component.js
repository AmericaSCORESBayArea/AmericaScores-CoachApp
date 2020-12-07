import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BottomNavigationTab, BottomNavigation, Icon, Button, OverflowMenu, MenuItem } from "@ui-kitten/components";
import TeamsScreen from "./src/TeamsScreen.component";
import ActivitiesScreen from "./src/Activities.Screen";
import AttendanceScreen from "./src/Attendance.Screen";
import QRScanScreen from "./src/components/QRScanner.component";
import { createStackNavigator } from '@react-navigation/stack';
import StudentsScreen from "./src/StudentsScreen.component";
import auth from '@react-native-firebase/auth';
import * as GoogleSignIn from 'expo-google-sign-in';

import { SafeAreaView } from 'react-native-safe-area-context';

import { useSelector, useDispatch } from 'react-redux';
import { logOutUser } from "./src/Redux/actions/user.actions";

const SchoolIcon = (props) => ( <Icon {...props} name='home-outline'/> );
const TodayIcon = (props) => ( <Icon {...props} name='calendar-outline'/> );
const StudentsIcon = (props) => ( <Icon {...props} name='people-outline'/> );

const BottomTabBar = ({ navigation, state }) => (
    <BottomNavigation 
    selectedIndex={state.index} 
    onSelect={index => navigation.navigate(state.routeNames[index])} >
        <BottomNavigationTab title='Sessions' icon={TodayIcon}/>
        <BottomNavigationTab title='Teams' icon={SchoolIcon}/>
        <BottomNavigationTab title='Students' icon={StudentsIcon}/>
    </BottomNavigation>
);

const Stack_Activities = createStackNavigator();
const Stack_Activities_Navigation = () => (
    <Stack_Activities.Navigator>
        <Stack_Activities.Screen options={headerOptions} name='Sessions' component={ActivitiesScreen}/>
        <Stack_Activities.Screen options={headerOptions} name="Attendance" component={AttendanceScreen} />
        <Stack_Activities.Screen options={headerOptions} name="Scan students QR" component={QRScanScreen}/>
    </Stack_Activities.Navigator>
);

const Stack_Teams = createStackNavigator();
const Stack_Teams_Navigation = ({navigation}) => (
    <Stack_Teams.Navigator>
        <Stack_Teams.Screen name="Teams" component={TeamsScreen} options={headerOptions}   initialParams={{ teamSeasonId: null }} />
        <Stack_Teams.Screen name='Team Activities' component={ActivitiesScreen} options={headerOptions} navigation={navigation}/>
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
const TabNavigator = () => (
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

export default OptionOverflowMenu = (navigation) => {
    const state = useSelector(state => state.user);
    const dispatch = useDispatch();

    const [visoverflowMenuVisibleble, setOverflowMenuVisible] = React.useState(false);
    
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

    logOutOnPress = async () => {
        try {
            setOverflowMenuVisible(false);
            await GoogleSignIn.signOutAsync();
            await dispatch(logOutUser());
            auth().signOut();
            // logged = false;
            navigation.navigate("Login");
        } catch (error) {console.log(error)}
    }

    return (
        <OverflowMenu
        anchor={OptionButtons}
        visible={visoverflowMenuVisibleble} 
        placement={"bottom"} 
        onBackdropPress={() => setOverflowMenuVisible(false)}>
            <MenuItem title='Create Student' onPress={() => menuItemOnPress("CreateStudentModal")} accessoryLeft={addStudentIcon}/>
            <MenuItem title='Add student to team' onPress={() => menuItemOnPress("AddStudentToTeamModal")} accessoryLeft={addStudentToSchoolIcon}/>
            <MenuItem title="Log out" onPress={() => (logOutOnPress())} accessoryLeft={logoutIcon}/>
        </OverflowMenu>
    );  
    
}; 

//this.menuItemOnPress("AddStudentToTeamModal")
const headerOptions = ({navigation}) => ({
        headerStyle: {
          backgroundColor: '#00467F',
        },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
        headerRight: () => <OptionOverflowMenu {...navigation}/>
    })

