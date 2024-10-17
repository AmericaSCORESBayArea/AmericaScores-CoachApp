/* eslint-disable tailwindcss/no-unnecessary-arbitrary-value */
/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation, useRouter } from 'expo-router';
import { Pressable, ScrollView, Text, View } from '@/ui';
import { ActivityIndicator } from 'react-native';
import PastSession from '../../components/sessions/past-session';
import UpComingSession from '@/components/sessions/upcoming-session';
import SessionsIndex from '@/components/common/sessionsIndex';
import { FlatList } from 'react-native';

import typography from '@/metrics/typography';
import { charcoal, primary } from '@/ui/colors';
import type { RootState } from '../../redux/store';
import { useSelector } from 'react-redux';

export default function Sessions() {
  const navigation = useNavigation();
  const router = useRouter();

  // Fetch the current sessions from Redux state
  const currentSessions = useSelector(
    (state: RootState) => state.allSessions.currentSessions
  );

  const pastSession = useSelector(
    (state: RootState) => state.allSessions.pastSessions
  );
  const upComingSession = useSelector(
    (state: RootState) => state.allSessions.upComingSessions
  );
  const isLoadingAllSessions = useSelector(
    (state: RootState) => state.allSessions.isLoadingAllSessions
  );

  useEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: '#EEF0F8',
      },
    });
  }, [navigation]);

  const [sessionEvents, setEvents] = useState<string>('Upcoming');
  const [isPastPressed, setIsPastPressed] = useState<boolean>(false);
  const [isUpComingPressed, setIsUpComingPressed] = useState<boolean>(true);

  const sessionEventHandler = (event: string) => {
    setEvents(event);
  };

  const pastHandlePress = () => {
    setIsPastPressed(true);
    setIsUpComingPressed(false);
    sessionEventHandler('Past');
  };

  const upcomingHandlePress = () => {
    setIsUpComingPressed(true);
    setIsPastPressed(false);
    sessionEventHandler('Upcoming');
  };

  const navigationHandler = (item: string) => {
    if (item === 'session-details') router.push('session-details');
    else if (item === 'team-season') router.push('team-season');
    else if (item === 'create-session') router.push('create-session');
  };

  return (
    <>
      <ScrollView className="flex-1 bg-[#EEF0F8]">
        <View className="ml-6">
          <Text style={(typography.style.heading, { color: charcoal[700] })}>
            Current Session
          </Text>
        </View>

        <View className="mx-6 rounded-sm ">
          <>
            {isLoadingAllSessions ? (
              <View className="mt-5">
                <ActivityIndicator size="small" color={'#000000'} />
              </View>
            ) : currentSessions && currentSessions.length > 0 ? ( // Check if currentSessions exist and are not empty
              <FlatList
                data={currentSessions}
                keyExtractor={(item) => item.SessionId}
                renderItem={({ item }) => <SessionsIndex item={item} />}
                contentContainerStyle={{
                  paddingVertical: 8,
                }}
              />
            ) : (
              // Show message when no sessions are available
              <View className="my-10 items-center justify-center">
                <Text>No Current Session Available</Text>
              </View>
            )}
          </>
        </View>

        <View className="ml-6 mt-4 w-[90%] flex-row justify-between">
          <Pressable
            className="w-[50%] items-center justify-center"
            onPress={upcomingHandlePress}
            style={{
              borderColor: isUpComingPressed ? primary[700] : 'null',
              borderBottomWidth: isUpComingPressed ? 2 : 0,
            }}
          >
            <Text
              style={typography.style.XXLHeading}
              className="text-primary-700"
            >
              Upcoming
            </Text>
          </Pressable>

          <Pressable
            className="w-[50%] items-center justify-center"
            onPress={pastHandlePress}
            style={{
              borderColor: isPastPressed ? primary[700] : 'null',
              borderBottomWidth: isPastPressed ? 2 : 0,
            }}
          >
            <Text
              style={typography.style.XXLHeading}
              className="text-primary-700"
            >
              Past
            </Text>
          </Pressable>
        </View>

        {sessionEvents === 'Past' && (
          <>
            {isLoadingAllSessions ? (
              <View className="mt-20">
                <ActivityIndicator size="small" color={'#000000'} />
              </View>
            ) : (
              <View className="mx-6 flex-1 rounded-sm ">
                <FlatList
                  data={pastSession}
                  keyExtractor={(item) => item.SessionId}
                  renderItem={({ item }) => <PastSession item={item} />}
                  contentContainerStyle={{ paddingVertical: 8 }}
                />
              </View>
            )}
          </>
        )}

        {sessionEvents === 'Upcoming' && (
          <>
            {isLoadingAllSessions ? (
              <View className="mt-20">
                <ActivityIndicator size="small" color={'#000000'} />
              </View>
            ) : (
              <View className="mx-6 flex-1 rounded-sm ">
                <FlatList
                  data={upComingSession}
                  keyExtractor={(item) => item.SessionId}
                  renderItem={({ item }) => <UpComingSession item={item} />}
                  contentContainerStyle={{ paddingVertical: 8 }}
                />
              </View>
            )}
          </>
        )}
      </ScrollView>

      <AntDesign
        name="pluscircle"
        size={typography.iconSizes.xxl}
        color="#004680"
        style={{
          position: 'absolute',
          bottom: 20,
          right: 20,
        }}
        onPress={() => navigationHandler('create-session')}
      />
    </>
  );
}
