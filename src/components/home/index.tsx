import { Ionicons } from '@expo/vector-icons';
import React from 'react';

import { colors, Pressable, Text, View } from '@/ui';
import { useRouter } from 'expo-router';

interface HomeItem {
  id: number;
  title: string;
  location: string;
  time: string;
  hobby: string[];
  navigation: string;
}

interface HomeTaskProps {
  item: HomeItem;
}

const HomeTask: React.FC<HomeTaskProps> = ({ item }) => {
  const router = useRouter();

  const navigationHandler = () => {
    router.push(item.navigation);
  };

  return (
    <Pressable
      className="mb-0.5 w-full rounded-sm bg-white"
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
          <Ionicons
            name="location-outline"
            size={24}
            color={colors.neutral[600]}
          />
          <Text className="color-neutral-600">{item.location}</Text>
        </View>

        <View className="my-1 flex-row">
          <Ionicons name="time-outline" size={24} color={colors.neutral[600]} />
          <Text className="color-neutral-600">{item.time}</Text>
        </View>

        <View className="my-1 flex-row">
          {item.hobby.map((hobby, index) => (
            <View
              key={index}
              className="mx-2 flex-row items-center rounded-2xl bg-slate-200 px-3"
            >
              <Ionicons
                name="football-outline" // Use appropriate icon here
                size={24}
                color={colors.neutral[600]}
              />
              <Text className="ml-2 color-neutral-600">{hobby}</Text>
            </View>
          ))}
        </View>
      </View>
    </Pressable>
  );
};

export default HomeTask;
