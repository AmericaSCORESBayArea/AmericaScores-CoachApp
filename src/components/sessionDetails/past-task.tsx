import { EvilIcons, Ionicons } from '@expo/vector-icons';
import React from 'react';

import { colors, Pressable, Text, View } from '@/ui';
interface PastItem {
  id: number;
  title: string;
  date: string;
  navigation: string;
}

interface PastTaskProps {
  item: PastItem;
}
const PastTask: React.FC<PastTaskProps> = ({ item }) => {
  return (
    <View className="mb-0.5 w-full rounded-md  bg-white ">
      <Pressable
        // onPress={() => toggleTaskExpand(item.id)}
        className="flex-row justify-between p-4"
      >
        <View className="flex-row ">
          <Ionicons name="camera" size={24} color="black" />
          <Text className="ml-3 font-bold">{item.title}</Text>
        </View>
        <Ionicons
          name="chevron-forward-sharp"
          size={24}
          color={colors.neutral[600]}
        />
      </Pressable>

      <View className="px-4">
        <View className="my-1 flex-row">
          <Ionicons name="time-outline" size={24} color={colors.neutral[600]} />
          <Text className="ml-3 color-neutral-600">Due: {item.date}</Text>
        </View>
      </View>
    </View>
  );
};

export default PastTask;
