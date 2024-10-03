import React from 'react';
import { Pressable, Text, View } from '@/ui';
import { useRouter } from 'expo-router';
import { ArrowForwardSVG } from '@/ui/icons/arrow-forward';
import { LocationSVG } from '@/ui/icons/location';
import { TimeSVG } from '@/ui/icons/time';

interface SoonItem {
  id: number;
  title: string;
  location: string;
  date: string;
  navigation: string;
}

interface SoonTaskProps {
  item: SoonItem;
}

const SoonTask: React.FC<SoonTaskProps> = ({ item }) => {
  const router = useRouter();
  const navigationHandler = () => {
    router.push(item.navigation);
  };
  return (
    <Pressable
      className="mb-0.5 w-full rounded-sm  bg-white "
      onPress={navigationHandler}
    >
      <View className="flex-row justify-between p-4">
        <Text className="font-bold">{item.title}</Text>
        <ArrowForwardSVG height={24} width={24} />
      </View>

      <View className="px-4">
        <View className="my-1 flex-row">
          <LocationSVG height={24} width={24} />
          <Text className="color-neutral-600">{item.location}</Text>
        </View>

        <View className="my-1 flex-row">
          <TimeSVG height={24} width={24} />
          <Text className="color-neutral-600">Due: {item.date}</Text>
        </View>
      </View>
    </Pressable>
  );
};

export default SoonTask;
