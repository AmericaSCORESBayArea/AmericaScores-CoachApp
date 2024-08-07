import React, { useEffect, useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  BottomNavigationTab,
  BottomNavigation,
  Icon,
  Button,
  OverflowMenu,
  MenuItem,
  CheckBox,
} from "@ui-kitten/components";
import TeamsScreen from "./src/TeamsScreen.component";
import ActivitiesScreen from "./src/Activities.Screen";
import AttendanceScreen from "./src/Attendance.Screen";
import SessionPhotograph from "./src/components/SessionPhotograph.component";
import QRScanScreen from "./src/components/QRScanner.component";
import { createStackNavigator } from "@react-navigation/stack";
import StudentSearchScreen from "./src/StudentSearch.Screen";
import ProfileScreen from "./src/Profile.Screen";
import { ApiConfig } from "./src/config/ApiConfig";
import analytics from "@react-native-firebase/analytics";
import auth from "@react-native-firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector, useDispatch } from "react-redux";
import { logOutUser } from "./src/Redux/actions/user.actions";
import {
  changeRegion,
  isUserFirstTime,
} from "./src/Redux/actions/SessionScreen.actions";

const Stack_Activities = createStackNavigator();
const Stack_Profile = createStackNavigator();
const Stack_Teams = createStackNavigator();
const { Navigator, Screen } = createBottomTabNavigator();

const TodayIcon = (props) => <Icon {...props} name="calendar-outline" />;
const StudentsIcon = (props) => <Icon {...props} name="people-outline" />;

const colorList = () => {
  if (useSelector((state) => state.sessionScreen.region) === "ASBA") {
    return "#00467F";
  } else {
    return "#001541";
  }
};

const BottomTabBar = ({ navigation, state, data }) =>
  //change order
  data === 0 ? (
    <BottomNavigation
      indicatorStyle={{ backgroundColor: colorList(), height: 4 }}
      selectedIndex={state.index}
      onSelect={(index) => navigation.navigate(state.routeNames[index])}
    >
      <BottomNavigationTab title="Sessions" icon={TodayIcon} />
      <BottomNavigationTab title="Teams" icon={StudentsIcon} />
      {/* <BottomNavigationTab title='Students'  icon={TodayIcon} /> */}
    </BottomNavigation>
  ) : (
    <BottomNavigation
      indicatorStyle={{ backgroundColor: colorList(), height: 4 }}
      selectedIndex={state.index}
      onSelect={(index) => navigation.navigate(state.routeNames[index])}
    >
      <BottomNavigationTab title="Teams" icon={StudentsIcon} />
      <BottomNavigationTab title="Sessions" icon={TodayIcon} />
      {/* <BottomNavigationTab title='Students'  icon={TodayIcon} /> */}
    </BottomNavigation>
  );

const Stack_Activities_Navigation = () => {
  const region = useSelector((state) => state.sessionScreen.region);
  const headerOptionsToUse =
    region === "ASBA" ? headerOptions : headerOptionsIFC;

  return (
    <Stack_Activities.Navigator>
      <Stack_Activities.Screen
        options={
          region === "ASBA" ? headerOptionsParams : headerOptionsParamsIFC
        }
        name="Sessions"
        component={ActivitiesScreen}
      />
      <Stack_Activities.Screen
        options={headerOptionsToUse}
        name="Attendance"
        component={AttendanceScreen}
      />
      <Stack_Activities.Screen
        name="Session Photograph"
        component={SessionPhotograph}
        options={headerOptionsToUse}
      />
      <Stack_Activities.Screen
        options={headerOptionsToUse}
        name="Scan students QR"
        component={QRScanScreen}
      />
    </Stack_Activities.Navigator>
  );
};

export const Stack_Profile_Navigation = () => {
  const user = useSelector((state) => state.user.user);
  const region = useSelector((state) => state.sessionScreen.region);
  const headerOptionsToUse =
    region === "ASBA" ? headerOptions : headerOptionsIFC;

  const profileName = user
    ? `My Profile: ${user.FirstName} ${user.LastName}`
    : "My Profile";

  return (
    <Stack_Profile.Navigator>
      <Stack_Profile.Screen
        options={headerOptionsToUse}
        name={profileName}
        component={ProfileScreen}
      />
    </Stack_Profile.Navigator>
  );
};

const Stack_Teams_Navigation = ({ navigation }) => {
  const region = useSelector((state) => state.sessionScreen.region);
  const headerOptionsToUse =
    region === "ASBA" ? headerOptions : headerOptionsIFC;
  return (
    <Stack_Teams.Navigator>
      <Stack_Teams.Screen
        name="Teams"
        component={TeamsScreen}
        options={headerOptionsToUse}
        initialParams={{ teamSeasonId: null }}
      />
      <Stack_Teams.Screen
        name="Team Sessions"
        component={ActivitiesScreen}
        options={{
          title: useSelector((state) => state.sessionScreen.teamname),
          headerStyle: {
            backgroundColor: colorList(),
          },
          headerTintColor: "#fff",
          headerTitleStyle: { fontWeight: "bold" },
          headerRight: () => <OptionsOverflowMenu {...navigation} />,
        }}
        navigation={navigation}
      />
      <Stack_Teams.Screen
        name="StudentSearch"
        component={StudentSearchScreen}
        options={headerOptionsToUse}
      />
      <Stack_Teams.Screen
        name="Attendance"
        component={AttendanceScreen}
        options={headerOptionsToUse}
      />
      <Stack_Teams.Screen
        name="Scan students QR"
        component={QRScanScreen}
        options={headerOptionsToUse}
      />
      <Stack_Teams.Screen
        name="Session Photograph"
        component={SessionPhotograph}
        options={headerOptions}
      />
    </Stack_Teams.Navigator>
  );
};

const TabNavigator = (navigation) => {
  const [customHomeProps, setCustomHomeProps] = React.useState();
  useFocusEffect(
    React.useCallback(() => {
      let isActive = true;
      const fetchCustomHomeScreen = async () => {
        try {
          const unsubscribe = await AsyncStorage.getItem("customHomeScreen");
          if (isActive) {
            if (unsubscribe === undefined || unsubscribe === null) {
              setCustomHomeProps(0);
            } else {
              setCustomHomeProps(JSON.parse(unsubscribe).id);
            }
          }
        } catch (e) {
          // Handle error
        }
      };
      fetchCustomHomeScreen();
      return () => {
        isActive = false;
      };
    }, [navigation])
  );
  return customHomeProps === 0 ? (
    <Navigator
      screenOptions={{
        tabBarShowLabel: true,
        headerShown: false,
      }}
      tabBar={(props) => <BottomTabBar {...props} data={customHomeProps} />}
    >
      <Screen name="ActivitiesStack" component={Stack_Activities_Navigation} />
      <Screen name="TeamsStack" component={Stack_Teams_Navigation} />
      <Screen name="profile" component={Stack_Profile_Navigation} />
      {/*<Screen name='StudentsScreen' component={Stack_Students_Navigation}/>*/}
    </Navigator>
  ) : customHomeProps === 1 ? (
    <Navigator
      screenOptions={{
        tabBarShowLabel: true,
        headerShown: false,
      }}
      tabBar={(props) => <BottomTabBar {...props} data={customHomeProps} />}
    >
      <Screen name="TeamsStack" component={Stack_Teams_Navigation} />
      <Screen name="ActivitiesStack" component={Stack_Activities_Navigation} />
      <Screen name="profile" component={Stack_Profile_Navigation} />
      {/*<Screen name='StudentsScreen' component={Stack_Students_Navigation}/>*/}
    </Navigator>
  ) : null;
};

export const HomeScreen = ({ navigation }) => {
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "white" }}
      edges={["right", "bottom", "left"]}
    >
      <TabNavigator navigation={navigation} />
    </SafeAreaView>
  );
};

export const OptionsOverflowMenu = (navigation) => {
  const state = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [checked, setChecked] = React.useState(false);
  useEffect(() => {
    const dismissFirebaseModal = async () => {
      const notifications = await AsyncStorage.getItem("appNotifications");
      // console.log(notifications);
      if (notifications === null || notifications === "true") {
        setChecked(true);
      } else {
        setChecked(false);
      }
    };
    dismissFirebaseModal();
  }, []);
  const [visoverflowMenuVisibleble, setOverflowMenuVisible] = useState(false);
  const coloroverflow = () => {
    if (useSelector((state) => state.sessionScreen.region) === "ASBA") {
      return "#00467F";
    } else {
      return "#001541";
    }
  };
  const OptionsIcon = (props) => (
    <Icon {...props} fill="#FFFFFF" name="more-vertical-outline" />
  );
  const addStudentToSchoolIcon = (props) => (
    <Icon {...props} name="person-add-outline" />
  );
  const addStudentIcon = (props) => <Icon {...props} name="plus-outline" />;
  const logoutIcon = (props) => <Icon {...props} name="log-out-outline" />;
  const changeaffiliateicon = (props) => (
    <Icon {...props} name="swap-outline" />
  );
  const profileicon = (props) => <Icon {...props} name="person-outline" />;
  const reporticon = (props) => (
    <Icon {...props} name="question-mark-circle-outline" />
  );
  const versionicon = (props) => <Icon {...props} name="info-outline" />;
  const howtouseicon = (props) => (
    <Icon {...props} name="play-circle-outline" />
  );
  const toggle = (props) => (
    <CheckBox
      {...props}
      status="basic"
      checked={checked}
      onChange={(nextChecked) => checkNotifications(nextChecked)}
    />
  );
  const OptionButtons = () => (
    <Button
      style={{ flex: 1, backgroundColor: coloroverflow }}
      appearance="ghost"
      accessoryRight={OptionsIcon}
      onPress={() => setOverflowMenuVisible(true)}
    />
  );
  async function menuItemOnPress(modalScreen) {
    await analytics().logSelectContent({
      content_type: `Pressed ${modalScreen}`,
      item_id: modalScreen,
    });
    setOverflowMenuVisible(false);
    navigation.navigate(modalScreen);
  }
  async function changeAfflitiation() {
    try {
      await analytics().logSelectContent({
        content_type: `Pressed affiliation change`,
        item_id: "affiliation-change",
      });
      setOverflowMenuVisible(false);
      dispatch(isUserFirstTime(true));
      await dispatch(changeRegion(null));
      navigation.navigate("Login", { screen: "Select_Club" });
    } catch (error) {
      console.log(error);
    }
  }
  async function profileScreen() {
    try {
      await analytics().logSelectContent({
        content_type: `Pressed profile`,
        item_id: "profile-screen",
      });
      setOverflowMenuVisible(false);
      navigation.navigate("profile");
    } catch (error) {
      console.log(error);
    }
  }
  async function logOutOnPress() {
    try {
      await analytics().logSelectContent({
        content_type: `Pressed log out button`,
        item_id: "log-out",
      });
      setOverflowMenuVisible(false);
      try {
        await AsyncStorage.clear();
      } catch (sError) {
        console.log("storage error", sError);
      }
      await GoogleSignin.signOut();
      try {
        await auth().signOut();
      } catch (aError) {
        console.log("auth error", aError);
      }
      await dispatch(logOutUser());
      await dispatch(changeRegion(null));
      navigation.navigate("MainLogin");
    } catch (error) {
      console.log(error);
    }
  }
  async function checkNotifications(checkProps) {
    if (checkProps) {
      // console.log(checkProps);
      await AsyncStorage.setItem("appNotifications", JSON.stringify(!checked));
      setChecked(checkProps);
    } else {
      // console.log(!checked);
      await AsyncStorage.setItem("appNotifications", JSON.stringify(!checked));
      setChecked(!checked);
    }
  }

  return (
    <OverflowMenu
      anchor={OptionButtons}
      visible={visoverflowMenuVisibleble}
      placement={"bottom end"}
      onBackdropPress={() => setOverflowMenuVisible(false)}
    >
      {/*<MenuItem title='Create Student' onPress={() => menuItemOnPress("CreateStudentModal")} accessoryLeft={addStudentIcon}/>
                <MenuItem title='Add student to team' onPress={() => menuItemOnPress("AddStudentToTeamModal")} accessoryLeft={addStudentToSchoolIcon}/>*/}
      <MenuItem
        title="My profile"
        onPress={() => profileScreen()}
        accessoryLeft={profileicon}
      />
      <MenuItem //Ivan: temporary disabled
        title="Change affiliation"
        onPress={() => changeAfflitiation()}
        accessoryLeft={changeaffiliateicon}
      />
      <MenuItem
        title="User guide"
        onPress={() => menuItemOnPress("userGuideModal")}
        accessoryLeft={howtouseicon}
      />
      <MenuItem
        title="Help"
        onPress={() => menuItemOnPress("CreateReportModal")}
        accessoryLeft={reporticon}
      />
      <MenuItem
        title="Notifications"
        onPress={() => checkNotifications()}
        accessoryLeft={toggle}
      />
      <MenuItem
        title="Log out"
        onPress={() => logOutOnPress()}
        accessoryLeft={logoutIcon}
      />
      <MenuItem
        title={ApiConfig.appVersion}
        disabled={true}
        accessoryLeft={versionicon}
      />
    </OverflowMenu>
  );
};

const headerOptions = ({ navigation }) => ({
  headerStyle: {
    backgroundColor: "#00467F",
  },
  headerTintColor: "#fff",
  headerTitleStyle: { fontWeight: "bold" },
  headerRight: () => <OptionsOverflowMenu {...navigation} />,
});
const headerOptionsIFC = ({ navigation }) => ({
  headerStyle: {
    backgroundColor: "#001541",
  },
  headerTintColor: "#fff",
  headerTitleStyle: { fontWeight: "bold" },
  headerRight: () => <OptionsOverflowMenu {...navigation} />,
});
const headerOptionsParams = ({ navigation }) => ({
  title: useSelector((state) => state.sessionScreen.title),
  headerStyle: {
    backgroundColor: "#00467F",
  },
  headerTintColor: "#fff",
  headerTitleStyle: { fontWeight: "bold" },
  headerRight: () => <OptionsOverflowMenu {...navigation} />,
});
const headerOptionsParamsIFC = ({ navigation }) => ({
  title: useSelector((state) => state.sessionScreen.title),
  headerStyle: {
    backgroundColor: "#001541",
  },
  headerTintColor: "#fff",
  headerTitleStyle: { fontWeight: "bold" },
  headerRight: () => <OptionsOverflowMenu {...navigation} />,
});
