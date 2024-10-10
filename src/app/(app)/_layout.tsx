/* eslint-disable react/no-unstable-nested-components */
import Feather from '@expo/vector-icons/Feather';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router, SplashScreen, Tabs } from 'expo-router';
import React, { useCallback, useEffect } from 'react';
import { LogBox, Dimensions } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

export default function TabLayout() {
  useEffect(() => {
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
  }, []);

  const hideSplash = useCallback(async () => {
    await SplashScreen.hideAsync();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      hideSplash();
    }, 1000);
  }, [hideSplash]);

  // Function to determine the appropriate icon size, width, and font size based on device type
  const getTabProperties = () => {
    const { width } = Dimensions.get('window');
    return width >= 768
      ? { iconSize: 45, iconClassName: 'w-20', fontSize: 24 } // Tablet properties
      : { iconSize: 22, iconClassName: '', fontSize: 12 }; // Mobile properties
  };

  const { iconSize, iconClassName, fontSize } = getTabProperties(); // Get the tab properties based on device type

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#EEF0F8',
          height: hp('10%'), // Set tab bar height responsively
          width: wp('100%'), // Ensure the tab bar takes full width
          paddingHorizontal: wp('2%'), // Add horizontal padding
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <Feather
              name="home"
              size={iconSize}
              color={color}
              className={iconClassName} // Apply width class conditionally
            />
          ),
          tabBarLabelStyle: { fontSize: fontSize }, // Apply font size conditionally
          tabBarTestID: 'home-tab',
        }}
      />
      <Tabs.Screen
        name="sessions"
        options={{
          title: 'Sessions',
          tabBarIcon: ({ color }) => (
            <Ionicons
              name="calendar-outline"
              size={iconSize}
              color={color}
              className={iconClassName} // Apply width class conditionally
            />
          ),
          tabBarLabelStyle: { fontSize: fontSize }, // Apply font size conditionally
          tabBarTestID: 'settings-tab',
        }}
      />
      <Tabs.Screen
        name="tasks"
        options={{
          title: 'Tasks',
          tabBarIcon: ({ color }) => (
            <FontAwesome5
              name="tasks"
              size={iconSize}
              color={color}
              className={iconClassName} // Apply width class conditionally
            />
          ),
          tabBarLabelStyle: { fontSize: fontSize }, // Apply font size conditionally
          tabBarTestID: 'tasks-tab',
        }}
      />
      <Tabs.Screen
        name="teams"
        options={{
          title: 'Teams',
          tabBarIcon: ({ color }) => (
            <Ionicons
              name="people-outline"
              size={iconSize}
              color={color}
              className={iconClassName} // Apply width class conditionally
            />
          ),
          tabBarLabelStyle: { fontSize: fontSize }, // Apply font size conditionally
          tabBarTestID: 'teams-tab',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => (
            <Ionicons
              name="person-outline"
              size={iconSize}
              color={color}
              className={iconClassName} // Apply width class conditionally
            />
          ),
          tabBarLabelStyle: { fontSize: fontSize }, // Apply font size conditionally
          tabBarTestID: 'profile-tab',
        }}
      />
    </Tabs>
  );
}
