import { EvilIcons, FontAwesome, Ionicons } from '@expo/vector-icons';
import React, { FC } from 'react';

import { colors, Pressable, Text, View } from '@/ui';
import { useRouter } from 'expo-router';
import PastSession from '../sessions/past-session';

interface PreviousSeasonType {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  attendence: number;
}
interface PreviousSeasonProps {
  item: PreviousSeasonType;
}

const PreviousSeason: React.FC<PreviousSeasonProps> = ({ item }) => {
  const router = useRouter();
  const navigationHandler = () => {
    // router.push(item.navigation);
  };
  return (
    <Pressable
      className="w-full rounded-sm bg-white  px-2"
      onPress={navigationHandler}
    >
      <View className="flex-row justify-between p-4">
        <Text className="font-bold">{item.name}</Text>
        <Ionicons
          name="chevron-forward-sharp"
          size={24}
          color={colors.neutral[600]}
        />
      </View>

      <View className="px-2">
        <View className="my-1 flex-row">
          <EvilIcons name="location" size={24} color={colors.neutral[600]} />
          <Text className="color-neutral-600">{item.startDate} - </Text>

          <Text className="color-neutral-600">{item.endDate}</Text>
        </View>

        <View className=" my-1 flex-row px-2">
          <Ionicons
            name="people-outline"
            size={24}
            color={colors.neutral[600]}
          />
          <Text className="color-neutral-600">{item.attendence}</Text>
        </View>
      </View>
    </Pressable>
  );
};

export default PreviousSeason;
