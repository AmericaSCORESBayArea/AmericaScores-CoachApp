/* eslint-disable react/no-unstable-nested-components */
// import { inscribeSessionsParams } from '@/interfaces/params/sessions/session-material';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Redirect, SplashScreen, Tabs } from 'expo-router';
import React, { useCallback, useEffect } from 'react';
import { LogBox } from 'react-native';

export default function TabLayout() {
  // useEffect(() => {
  //   inscribeSessionsParams('a0qcX000000GEggQAG', '2024-08-23');
  // }, []);
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

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#EEF0F8',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <Feather name="home" size={24} color={color} />
            // <Home color={color} />
          ),
          // headerRight: () => <CreateNewPostLink />,
          tabBarTestID: 'home-tab',
        }}
      />
      <Tabs.Screen
        name="sessions"
        options={{
          title: 'Sessions',
          tabBarIcon: ({ color }) => (
            <Ionicons name="calendar-outline" size={24} color={color} />
          ),
          tabBarTestID: 'settings-tab',
        }}
      />

      <Tabs.Screen
        name="tasks"
        options={{
          title: 'Tasks',
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="tasks" size={24} color={color} />
          ),
          tabBarTestID: 'tasks-tab',
        }}
      />
      <Tabs.Screen
        name="teams"
        options={{
          title: 'Teams',
          tabBarIcon: ({ color }) => (
            <Ionicons name="people-outline" size={24} color={color} />
          ),
          tabBarTestID: 'teams-tab',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => (
            <Ionicons name="person-outline" size={24} color={color} />
          ),
          tabBarTestID: 'profile-tab',
        }}
      />
      {/* <Tabs.Screen
        name="take-attendence"
        options={{
          title: 'Take Attendence',
          tabBarIcon: ({ color }) => (
            <Ionicons name="person-outline" size={24} color={color} />
          ),
          tabBarTestID: 'test-tab',
        }}
      /> */}
    </Tabs>
  );
}
