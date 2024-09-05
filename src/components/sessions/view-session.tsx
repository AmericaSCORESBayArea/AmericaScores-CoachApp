/* eslint-disable react-native/no-inline-styles */
/* eslint-disable unused-imports/no-unused-vars */
import { FlashList } from '@shopify/flash-list';
import { useNavigation } from 'expo-router';
import React, { useEffect, useState } from 'react';

import LaterTask from '@/components/sessions/later-task';
import SoonTask from '@/components/sessions/soon-task';
import WeekTask from '@/components/sessions/week-task';
import { laterTaskData, soonTaskData, weekTaskData } from '@/data/data-base';
import { ScrollView, Text, View } from '@/ui';

// import { Soccer } from '@/ui/icons/soccer';

export default function ViewSession() {
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

  return (
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
  );
}
