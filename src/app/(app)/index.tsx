import { FlashList } from '@shopify/flash-list';
import { useNavigation } from 'expo-router';
import React, { useEffect, useState } from 'react';

import HomeTask from '@/components/home';
import SoonTask from '@/components/sessions/soon-task';
import { sessionData, soonTaskData } from '@/data/data-base';
import { ScrollView, Text, View } from '@/ui';
// import { Soccer } from '@/ui/icons/soccer';

export default function Feed() {
  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: '#EEF0F8',
      },
      headerTitle: '',
    });
  }, [navigation]);
  // const [expandedTaskItem, setExpandedTaskItem] = useState<number | null>(null);
  const [expandedSessionItem, setExpandedSessionItem] = useState<number | null>(
    null
  );

  const toggleSessionExpand = (id: number) => {
    setExpandedSessionItem((prev) => (prev === id ? null : id));
  };

  // const toggleTaskExpand = (id: number) => {
  //   setExpandedTaskItem((prev) => (prev === id ? null : id));
  // };

  return (
    <ScrollView className="flex-1 bg-[#EEF0F8]">
      <View className="ml-6">
        <Text className="my-3 text-lg font-bold text-[#000] ">Hi Joe,</Text>
      </View>
      <View className="mx-6 flex-1 rounded-sm bg-[#EEF0F8]">
        <FlashList
          data={sessionData}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <HomeTask
              item={item}
              expandedSessionItem={expandedSessionItem}
              toggleSessionExpand={toggleSessionExpand}
            />
          )}
          estimatedItemSize={80}
          contentContainerStyle={{
            paddingVertical: 8,
          }}
          key={expandedSessionItem}
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
          // key={expandedTaskItem}
        />
      </View>
    </ScrollView>
  );
}
