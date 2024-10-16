/* eslint-disable tailwindcss/no-unnecessary-arbitrary-value */
/* eslint-disable react-hooks/exhaustive-deps */
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
import { pastSessionData, sessionSingleData } from '@/data/data-base';
import { useGetCoachAllSessionsQuery } from '@/redux/sessions/sessions-endpoint';
import { GetSessionsAdapter } from '@/api/adaptars/sessions/session-adapter';
import type { GetAllSessions } from '@/interfaces/entities/session/sessions-entities';
import pastSession from '../../components/sessions/past-session';
import typography from '@/metrics/typography';
import { charcoal, neutral, primary } from '@/ui/colors';

export default function Sessions() {
  const navigation = useNavigation();
  const router = useRouter();

  const [currentSession, setCurrentSession] = useState<GetAllSessions[]>();
  const [upComingSession, setUpComingSession] = useState<GetAllSessions[]>();
  const [pastSession, setPastSession] = useState<GetAllSessions[]>();
  ///////////////////// All Coach Sessions //////////////////////////
  const {
    data: Allsessions,
    isLoading: isLoadingSessions,
    isError: isErrorSession,
  } = useGetCoachAllSessionsQuery({
    regions: `'San Francisco Crocker','San Francisco Civic Center'`, // Update to regions
    startDate: '2018-08-01', // Adjust to the relevant date range
    endDate: '2026-06-21', // Use the relevant end date
    limit: 100, // Optional, can be omitted
    offset: 0, // Optional, can be omitted
  });
  const allCoachSessions = Allsessions
    ? GetSessionsAdapter.getSelectors().selectAll(Allsessions)
    : [];
  useEffect(() => {
    console.log('AllCoachSession: ', allCoachSessions);

    // Today's date for comparison
    const today = new Date();
    const todayString = today.toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format

    const upcomingSessions: GetAllSessions[] = [];
    const pastSessions: GetAllSessions[] = [];
    const currentSessions: GetAllSessions[] = [];

    allCoachSessions.forEach((session) => {
      const sessionDate = new Date(session.SessionDate);
      // console.log('sesssionDate : ', session.SessionDate);

      const sessionDateString = sessionDate.toISOString().split('T')[0]; // Format session date to YYYY-MM-DD
      // console.log(sessionDateString, '+', todayString);

      if (sessionDateString === todayString) {
        currentSessions.push(session);
      } else if (sessionDate > today) {
        upcomingSessions.push(session);
      } else if (sessionDate < today) {
        pastSessions.push(session);
      }
    });

    // Update state
    setCurrentSession(currentSessions);
    setUpComingSession(upcomingSessions);
    setPastSession(pastSessions);

    // Log the state variables after setting them
    console.log('Current sessions: ', currentSessions);
    console.log('Upcoming sessions: ', upcomingSessions);
    console.log('Past sessions: ', pastSessions);
  }, [Allsessions]);
  ///////////////////// End //////////////////////////
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
            Next Session
          </Text>
        </View>

        <View className="mx-6 rounded-sm ">
          <FlatList
            data={sessionSingleData}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <SessionsIndex item={item} />}
            contentContainerStyle={{ paddingVertical: 8 }}
          />
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
            {isLoadingSessions ? (
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
            {isLoadingSessions ? (
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
