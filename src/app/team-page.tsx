/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import React, { useEffect } from 'react';
import { useNavigation } from 'expo-router';
import { currentSeasonsData, previousSeasonsData } from '@/data/data-base';
import { ScrollView } from '@/ui';
import CurrentSeason from '@/components/teams/current-season';
import PreviousSeason from '@/components/teams/previous-seasons';
import { ArrowBackwardSVG } from '@/ui/icons/arrow-backward';

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
          <ArrowBackwardSVG height={24} width={24} />
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
        <FlatList
          data={currentSeasonsData}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <CurrentSeason item={item} />}
          contentContainerStyle={{
            paddingVertical: 8,
          }}
        />
      </View>
      <View className="ml-6">
        <Text className="my-3 text-base font-[800] text-[#737373]  ">
          Previous Seasons
        </Text>
      </View>
      <View className="mx-6 flex-1 rounded-sm bg-[#EEF0F8]">
        <FlatList
          data={previousSeasonsData}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <PreviousSeason item={item} />}
          contentContainerStyle={{
            paddingVertical: 8,
          }}
        />
      </View>
    </ScrollView>
  );
};

export default TeamPage;
