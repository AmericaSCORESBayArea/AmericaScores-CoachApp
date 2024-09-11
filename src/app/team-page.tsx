/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import { View, Text, TouchableOpacity } from 'react-native';
import React, { useEffect } from 'react';
import { useNavigation } from 'expo-router';
import {
  Ionicons,
  EvilIcons,
  FontAwesome,
  AntDesign,
} from '@expo/vector-icons';
import {
  currentSeasonsData,
  pastTaskData,
  previousSeasonsData,
  sessionSingleData,
  toDoTaskData,
} from '@/data/data-base';
import { colors, ScrollView } from '@/ui';
import ToDoTask from '@/components/sessionDetails/to-do-task';
import { FlashList } from '@shopify/flash-list';
import PastTask from '@/components/sessionDetails/past-task';
import CurrentSeason from '@/components/teams/current-season';
import PreviousSeason from '@/components/teams/previous-seasons';

const TeamPage = () => {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: '#EEF0F8',
      },
      headerTitle: 'Developer Test Soccer Poets',
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.goBack()} className="mx-4">
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);
  return (
    <ScrollView className="flex-1 bg-[#EEF0F8]">
      <View className="ml-6">
        <Text className="my-3 text-base font-[800] text-[#737373]  ">
          Current Season
        </Text>
      </View>
      <View className="mx-6 flex-1 rounded-sm bg-[#EEF0F8]">
        <FlashList
          data={currentSeasonsData}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <CurrentSeason item={item} />}
          estimatedItemSize={80}
          contentContainerStyle={{
            paddingVertical: 8,
          }}
          // key={expandedTaskItem}
        />
      </View>
      <View className="ml-6">
        <Text className="my-3 text-base font-[800] text-[#737373]  ">
          Previous Seasons
        </Text>
      </View>
      <View className="mx-6 flex-1 rounded-sm bg-[#EEF0F8]">
        <FlashList
          data={previousSeasonsData}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <PreviousSeason item={item} />}
          estimatedItemSize={80}
          contentContainerStyle={{
            paddingVertical: 8,
          }}
          // key={expandedTaskItem}
        />
      </View>
    </ScrollView>
  );
};

export default TeamPage;
