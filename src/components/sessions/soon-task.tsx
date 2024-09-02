import { EvilIcons, Ionicons } from '@expo/vector-icons';
import React from 'react';

import { colors, Pressable, Text, View } from '@/ui';

interface SoonItem {
  id: number;
  title: string;
  location: string;
  date: string;
}

interface SoonTaskProps {
  item: SoonItem;
}

const SoonTask: React.FC<SoonTaskProps> = ({ item }) => {
  return (
    <View className="mb-0.5 w-full rounded-sm  bg-white ">
      <Pressable
        // onPress={() => toggleTaskExpand(item.id)}
        className="flex-row justify-between p-4"
      >
        <Text className="font-bold">{item.title}</Text>
        <Ionicons
          name="chevron-forward-sharp"
          size={24}
          color={colors.neutral[600]}
        />
      </Pressable>

      <View className="px-4">
        <View className="my-1 flex-row">
          <EvilIcons name="location" size={24} color={colors.neutral[600]} />
          <Text className="color-neutral-600">{item.location}</Text>
        </View>

        <View className="my-1 flex-row">
          <Ionicons name="time-outline" size={24} color={colors.neutral[600]} />
          <Text className="color-neutral-600">Due: {item.date}</Text>
        </View>
      </View>
    </View>
  );
};

export default SoonTask;
