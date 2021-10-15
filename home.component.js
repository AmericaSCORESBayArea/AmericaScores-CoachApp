import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BottomNavigationTab, BottomNavigation, Icon, Button, OverflowMenu, MenuItem,  TopNavigationAction, TabBar, Tab, Layout, Text} from "@ui-kitten/components";
import TeamsScreen from "./src/TeamsScreen.component";
import ActivitiesScreen from "./src/Activities.Screen";
import AttendanceScreen from "./src/Attendance.Screen";
import QRScanScreen from "./src/components/QRScanner.component";
import { createStackNavigator } from '@react-navigation/stack';
import StudentsScreen from "./src/StudentsScreen.component";
import StudentSearchScreen from "./src/StudentSearch.Screen";
import Profile from "./src/Profile.Screen";
import { ApiConfig } from './src/config/ApiConfig';

import auth from '@react-native-firebase/auth';
import * as GoogleSignIn from 'expo-google-sign-in';

import { SafeAreaView } from 'react-native-safe-area-context';

import { useSelector, useDispatch } from 'react-redux';
import { logOutUser } from "./src/Redux/actions/user.actions";
import { changeRegion } from "./src/Redux/actions/SessionScreen.actions";

const SchoolIcon = (props) => ( <Icon {...props} name='home-outline'/> );
const TodayIcon = (props) => ( <Icon {...props} name='calendar-outline'/> );
const StudentsIcon = (props) => ( <Icon {...props} name='people-outline'/> );
const colorList = () =>{
    if(useSelector(state => state.sessionScreen.region) === "ASBA"){
        return '#00467F'
    }else{
        return "#001541"
    }
}
  
const BottomTabBar = ({ navigation, state }) => (
    <BottomNavigation
    indicatorStyle={{backgroundColor: colorList(), height: 4}} 
    selectedIndex={state.index} 
    onSelect={index => navigation.navigate(state.routeNames[index])} >
        <BottomNavigationTab title='Sessions' icon={TodayIcon} />
        <BottomNavigationTab title='Teams'  icon={StudentsIcon} />
        {/* <BottomNavigationTab title='Students'  icon={TodayIcon} /> */}
    </BottomNavigation>
);

const Stack_Activities = createStackNavigator();
const Stack_Activities_Navigation = () => (
    (useSelector(state => state.sessionScreen.region) === "ASBA")?
    <Stack_Activities.Navigator>
        <Stack_Activities.Screen options={headerOptionsParams} name="Sessions" component={ActivitiesScreen}/>
        <Stack_Activities.Screen options={headerOptions} name="Attendance" component={AttendanceScreen} />
        <Stack_Activities.Screen options={headerOptions} name="Scan students QR" component={QRScanScreen}/>
    </Stack_Activities.Navigator>:
    <Stack_Activities.Navigator>
        <Stack_Activities.Screen options={headerOptionsParamsIFC} name="Sessions" component={ActivitiesScreen}/>
        <Stack_Activities.Screen options={headerOptionsIFC} name="Attendance" component={AttendanceScreen} />
        <Stack_Activities.Screen options={headerOptionsIFC} name="Scan students QR" component={QRScanScreen}/>
    </Stack_Activities.Navigator>
);

const Stack_Profile = createStackNavigator();
const Stack_Profile_Navigation = () => (
    (useSelector(state => state.sessionScreen.region) === "ASBA")?
    <Stack_Profile.Navigator>
        <Stack_Profile.Screen options={headerOptions} name="My Profile" component={Profile}/>
    </Stack_Profile.Navigator>:
    <Stack_Profile.Navigator>
        <Stack_Profile.Screen options={headerOptionsIFC} name="My Profile" component={Profile}/>
    </Stack_Profile.Navigator>
);

const Stack_Teams = createStackNavigator();
const Stack_Teams_Navigation = ({navigation}) => (
    (useSelector(state => state.sessionScreen.region) === "ASBA")?
    <Stack_Teams.Navigator>
        <Stack_Teams.Screen name="Teams" component={TeamsScreen} options={headerOptions}   initialParams={{ teamSeasonId: null }} />
        <Stack_Teams.Screen name='Team Sessions' component={ActivitiesScreen} options={{
          title: useSelector(state => state.sessionScreen.teamname),
          headerStyle: {
          backgroundColor: "#00467F",
        },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold'},
        headerRight: () => <OptionOverflowMenu {...navigation}/>}} navigation={navigation}/>
        <Stack_Teams.Screen name="StudentSearch" component={StudentSearchScreen} options={headerOptions}/>
        <Stack_Teams.Screen name="Attendance" component={AttendanceScreen} options={headerOptions} />
        <Stack_Teams.Screen name="Scan students QR" component={QRScanScreen} options={headerOptions}/>
    </Stack_Teams.Navigator>
    :
    <Stack_Teams.Navigator>
        <Stack_Teams.Screen name="Teams" component={TeamsScreen} options={headerOptionsIFC}  initialParams={{ teamSeasonId: null }} />
        <Stack_Teams.Screen name='Team Sessions' component={ActivitiesScreen} 
        options={{
          title: useSelector(state => state.sessionScreen.teamname),
          headerStyle: {
          backgroundColor: "#001541",
        },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold'},
        headerRight: () => <OptionOverflowMenu {...navigation}/>}} navigation={navigation}/>
        <Stack_Teams.Screen name="StudentSearch" component={StudentSearchScreen} options={headerOptionsIFC}/>
        <Stack_Teams.Screen name="Attendance" component={AttendanceScreen} options={headerOptionsIFC} />
        <Stack_Teams.Screen name="Scan students QR" component={QRScanScreen} options={headerOptionsIFC}/>
    </Stack_Teams.Navigator>

);
const Stack_Affiliation = createStackNavigator();

const { Navigator, Screen } = createBottomTabNavigator();
const TabNavigator = () => (
    <Navigator tabBar={props => <BottomTabBar {...props} /> } >
        <Screen name="ActivitiesStack" component={Stack_Activities_Navigation} />
        <Screen name='TeamsStack' component={Stack_Teams_Navigation}/>
        <Screen name='profile' component={Stack_Profile_Navigation}/>
        {/*<Screen name='StudentsScreen' component={Stack_Students_Navigation}/>*/}
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
    const coloroverflow = () =>{
        if(useSelector(state => state.sessionScreen.region) === "ASBA"){
            return '#00467F'
        }else{
            return "#001541"
        }
    }
    const OptionsIcon = (props) => ( <Icon {...props} fill="#FFFFFF" name='more-vertical-outline' /> );
    const addStudentToSchoolIcon = (props) => (<Icon {...props} name="person-add-outline"/>);
    const addStudentIcon = (props) => (<Icon {...props} name='plus-outline'/>);
    const logoutIcon = (props) => (<Icon {...props} name='log-out-outline'/>);
    const changeaffiliateicon = (props) => (<Icon {...props} name='swap-outline'/>);
    const profileicon = (props) => (<Icon {...props} name='person-outline' />);
    const reporticon= (props) => (<Icon {...props}  name='question-mark-circle-outline'/>);
    const versionicon= (props) => (<Icon {...props}  name='info-outline'/>);

    const OptionButtons = () => (
        <Button style={{flex:1, backgroundColor: coloroverflow}} appearance='ghost' accessoryRight={OptionsIcon} onPress={() => setOverflowMenuVisible(true)}/>
    );

    function menuItemOnPress(modalScreen) {
        setOverflowMenuVisible(false);
        navigation.navigate(modalScreen);
    };

    async function changeAfflitiation(){
        try{
            setOverflowMenuVisible(false);
            await dispatch(changeRegion(null));         
            navigation.navigate('Login', { screen: 'Select_Club' });
        } catch (error) {console.log(error)}
    }
    async function profileScreen(){
        try{
            setOverflowMenuVisible(false);
            navigation.navigate('profile');
        } catch (error) {console.log(error)}
    }
    async function logOutOnPress(){
        try {
            setOverflowMenuVisible(false);
            await GoogleSignIn.signOutAsync();
            await auth().signOut();
            await dispatch(logOutUser());
            await dispatch(changeRegion(null));
            navigation.navigate("Login");
        } catch (error) {console.log(error)}
    }
    

    return (
        <OverflowMenu
            anchor={OptionButtons}
            visible={visoverflowMenuVisibleble}
            placement={"bottom end"} 
            onBackdropPress={() => setOverflowMenuVisible(false)}>
                {/*<MenuItem title='Create Student' onPress={() => menuItemOnPress("CreateStudentModal")} accessoryLeft={addStudentIcon}/>
                <MenuItem title='Add student to team' onPress={() => menuItemOnPress("AddStudentToTeamModal")} accessoryLeft={addStudentToSchoolIcon}/>*/}
                <MenuItem title="My Profile" onPress={() => (profileScreen())}  accessoryLeft={profileicon}/>
                <MenuItem title="Change affiliation" onPress={() => (changeAfflitiation())} accessoryLeft={changeaffiliateicon}/>
                <MenuItem title="Help"  onPress={() => menuItemOnPress("CreateReportModal")} accessoryLeft={reporticon}/>
                <MenuItem title="Log out" onPress={() => (logOutOnPress())} accessoryLeft={logoutIcon}/>
                <MenuItem title={ApiConfig.appVersion}  disabled={true} accessoryLeft={versionicon} />
        </OverflowMenu>
    );  
    
}; 
//this.menuItemOnPress("AddStudentToTeamModal")
const headerOptions = ({navigation}) => ({
        headerStyle: {
          backgroundColor: "#00467F",
        },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
        headerRight: () => <OptionOverflowMenu {...navigation}/>
    })
const headerOptionsIFC = ({navigation}) => ({
        headerStyle: {
          backgroundColor: "#001541",
        },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
        headerRight: () => <OptionOverflowMenu {...navigation}/>
})
const headerOptionsParams = ({navigation}) => ({
        title: useSelector(state => state.sessionScreen.title),
        headerStyle: {
          backgroundColor: "#00467F",
        },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
        headerRight: () => <OptionOverflowMenu {...navigation}/>
})
const headerOptionsParamsIFC = ({navigation}) => ({
        title: useSelector(state => state.sessionScreen.title),
        headerStyle: {
          backgroundColor: "#001541",
        },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
        headerRight: () => <OptionOverflowMenu {...navigation}/>
})
