/* eslint-disable unused-imports/no-unused-vars */
import { FlashList } from '@shopify/flash-list';
import { useNavigation } from 'expo-router';
import React, { useEffect, useState } from 'react';

import Index from '@/components/task';
import { taskData } from '@/data/data-base';
import { ScrollView, Text, View } from '@/ui';

export default function Tasks() {
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

  return (
    <ScrollView className="flex-1 bg-[#EEF0F8]">
      <View className="ml-6">
        <Text className="my-3 text-lg font-bold text-[#000] ">Task</Text>
      </View>
      <View className="mx-6 flex-1 rounded-sm bg-[#EEF0F8]">
        <FlashList
          data={taskData}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <Index item={item} />}
          estimatedItemSize={80}
          contentContainerStyle={{
            paddingVertical: 8,
          }}
          // key={expandedSessionItem}
        />
      </View>
    </ScrollView>
  );
}
