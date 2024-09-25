/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import { EvilIcons, FontAwesome, Ionicons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import { useNavigation, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';

import HomeTask from '@/components/home';
import SoonTask from '@/components/sessions/soon-task';
import { sessionData, sessionSingleData, soonTaskData } from '@/data/data-base';
import { colors, Pressable, ScrollView, Text, View } from '@/ui';
import { useGetCoachRegionsQuery } from '@/redux/regions/regions-endpoints';
import { regionAdapter } from '@/api/adaptars/regions/region-adapter';
import { useGetTeamSeasonQuery } from '@/redux/teamseason/team-season-endpoints';
import { teamSeasonsAdapter } from '@/api/adaptars/teamSeason/teamseason-adapter';
import { useGetCoachSessionsQuery } from '@/redux/sessions/sessions-endpoint';
import { sessionsAdapter } from '@/api/adaptars/sessions/session-adapter';

export default function Feed() {
  const navigation = useNavigation();
  const router = useRouter();
  useEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: '#EEF0F8',
      },
      headerTitle: '',
    });
  }, [navigation]);

  const {
    data: regions,
    isLoading: isLoadingRegions,
    isError: isErrorRegions,
  } = useGetCoachRegionsQuery();
  const {
    data: teams,
    isLoading: isLoadingTeams,
    isError: isErrorTeams,
  } = useGetTeamSeasonQuery();
  const {
    data: sessions,
    isLoading: isLoadingSessions,
    isError: isErrorSession,
  } = useGetCoachSessionsQuery();

  const allTeamSeasons = teams
    ? teamSeasonsAdapter.getSelectors().selectAll(teams)
    : [];

  const allCoachRegions = regions
    ? regionAdapter.getSelectors().selectAll(regions)
    : [];
  const allCoachSessions = sessions
    ? sessionsAdapter.getSelectors().selectAll(sessions)
    : [];
  useEffect(() => {
    // console.log('allCoachRegions', allCoachRegions);
    // console.log('allTeamSeasons', allTeamSeasons);
    console.log('allCoachSessions', allCoachSessions);
  }, [allTeamSeasons, allCoachRegions, allCoachSessions]);
  if (isLoadingRegions || isLoadingTeams || isLoadingSessions)
    return <Text>Loading...</Text>;
  if (isErrorRegions || isErrorTeams || isErrorSession)
    return <Text>Error loading regions.</Text>;

  const navigationHandler = (item: string) => {
    if (item === 'session-details') {
      router.push('session-details');
    } else if (item === 'team-season') {
      router.push('team-season');
    }
  };
  return (
    <ScrollView className="flex-1 bg-[#EEF0F8]">
      <View className="ml-6">
        <Text className="my-3 text-lg font-bold text-[#000] ">Hi Joe,</Text>
      </View>
      <Pressable
        className=" mx-6  w-[90%] justify-center rounded-sm bg-white"
        onPress={() => navigationHandler('session-details')}
      >
        <Pressable
          // onPress={() => toggleSessionExpand(item.id)}
          className="flex-row justify-between p-4"
          onPress={() => navigationHandler('team-season')}
        >
          <Text className="font-bold">{sessionSingleData[0].title}</Text>
          {/* <Ionicons
            name="chevron-forward-sharp"
            size={18}
            color={colors.neutral[600]}
          /> */}
        </Pressable>
        <View className="px-4">
          <View className="my-1 flex-row">
            <EvilIcons name="location" size={24} color={colors.neutral[600]} />
            <Text className="color-neutral-600">
              {sessionSingleData[0].location}
            </Text>
          </View>

          <View className="my-1 flex-row">
            <Ionicons
              name="time-outline"
              size={24}
              color={colors.neutral[600]}
            />
            <Text className="color-neutral-600">
              {sessionSingleData[0].time}
            </Text>
          </View>

          <View className="my-1 flex-row">
            {sessionSingleData[0].hobby.map((hobby, index) => (
              <View
                key={index}
                className="mx-2 flex-row items-center rounded-2xl bg-slate-200 px-3"
              >
                <FontAwesome
                  name="soccer-ball-o"
                  size={24}
                  color={colors.neutral[600]}
                />
                <Text className="ml-2 color-neutral-600">{hobby}</Text>
              </View>
            ))}
          </View>
        </View>
      </Pressable>
      <View className="mx-6 flex-1 rounded-sm bg-[#EEF0F8]">
        <FlashList
          data={sessionData}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <HomeTask item={item} />}
          estimatedItemSize={80}
          contentContainerStyle={{
            paddingVertical: 8,
          }}
        />
      </View>

      <View className="ml-6">
        <Text className="my-3 text-base font-[800] text-[#737373]  ">
          Due Soon Task
        </Text>
      </View>
      <View className="mx-6 flex-1 rounded-sm bg-[#EEF0F8]">
        <FlashList
          data={soonTaskData}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <SoonTask item={item} />}
          estimatedItemSize={80}
          contentContainerStyle={{
            paddingVertical: 8,
          }}
        />
      </View>
    </ScrollView>
  );
}
