import { EvilIcons, Ionicons } from '@expo/vector-icons';
import React from 'react';

import { colors, Pressable, Text, View } from '@/ui';
import { useRouter } from 'expo-router';

interface WeekItem {
  id: number;
  title: string;
  location: string;
  date: string;
  navigation: string;
}

interface WeekTaskProps {
  item: WeekItem;
}

const WeekTask: React.FC<WeekTaskProps> = ({ item }) => {
  const router = useRouter();
  const navigationHandler = () => {
    router.push(item.navigation);
  };
  return (
    <Pressable
      className="mb-0.5 w-full rounded-sm  bg-white"
      onPress={navigationHandler}
    >
      <View className="flex-row justify-between p-4">
        <Text className="font-bold">{item.title}</Text>
        <Ionicons
          name="chevron-forward-sharp"
          size={24}
          color={colors.neutral[600]}
        />
      </View>

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
    </Pressable>
  );
};

export default WeekTask;
