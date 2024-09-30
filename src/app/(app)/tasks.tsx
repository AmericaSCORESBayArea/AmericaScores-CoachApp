/* eslint-disable react-native/no-inline-styles */

import { FlashList } from '@shopify/flash-list';
import { useNavigation, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';

import LaterTask from '@/components/task/later-task';
import SoonTask from '@/components/home/soon-task';
import WeekTask from '@/components/task/week-task';
import { laterTaskData, soonTaskData, weekTaskData } from '@/data/data-base';
import { ScrollView, Text, TouchableOpacity, View } from '@/ui';
import { AntDesign, Ionicons } from '@expo/vector-icons';

// import { Soccer } from '@/ui/icons/soccer';

export default function Tasks() {
  const router = useRouter();

  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: '#EEF0F8',
      },
      headerTitle: '',
    });
  }, [navigation]);
  const [expandedSessionItem, setExpandedSessionItem] = useState<number | null>(
    null
  );

  const toggleSessionExpand = (id: number) => {
    setExpandedSessionItem((prev) => (prev === id ? null : id));
  };
  const navigationHandler = (item: string) => {
    if (item === 'create-personal-task') router.push('create-personal-task');
  };
  return (
    <>
      <ScrollView className="flex-1 bg-[#EEF0F8]">
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
            // key={expandedTaskItem}
          />
        </View>
        <View className="ml-6">
          <Text className="my-3 text-base font-[800] text-[#737373]  ">
            Due to this week
          </Text>
        </View>
        <View className="mx-6 flex-1 rounded-sm bg-[#EEF0F8]">
          <FlashList
            data={weekTaskData}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <WeekTask item={item} />}
            estimatedItemSize={80}
            contentContainerStyle={{
              paddingVertical: 8,
            }}
            // key={expandedTaskItem}
          />
        </View>
        <View className="ml-6">
          <Text className="my-3 text-base font-[800] text-[#737373]  ">
            Later
          </Text>
        </View>
        <View className="mx-6 flex-1 rounded-sm bg-[#EEF0F8]">
          <FlashList
            data={laterTaskData}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <LaterTask item={item} />}
            estimatedItemSize={80}
            contentContainerStyle={{
              paddingVertical: 8,
            }}
            // key={expandedTaskItem}
          />
        </View>
      </ScrollView>
      <AntDesign
        name="pluscircle"
        size={45}
        color="#004680"
        style={{
          position: 'absolute',
          bottom: 20, // Adjust the distance from the bottom
          right: 20, // Adjust the distance from the right
        }}
        onPress={() => navigationHandler('create-personal-task')}
      />
    </>
  );
}
