import React from 'react';
import { Pressable, Text, View } from '@/ui';
import { useRouter } from 'expo-router';
import { ArrowForwardSVG } from '@/ui/icons/arrow-forward';
import { LocationSVG } from '@/ui/icons/location';
import { DoubleTakeAttendanceSVG } from '@/ui/icons/double-take-attendance';

interface CurrentSeasonType {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  attendence: number;
}
interface CurrentSeasonProps {
  item: CurrentSeasonType;
}

const CurrentSeason: React.FC<CurrentSeasonProps> = ({ item }) => {
  const router = useRouter();
  const navigationHandler = () => {
    // router.push(item.navigation);
  };
  return (
    <Pressable
      className=" mb-1 w-full rounded-sm bg-white  px-2"
      onPress={navigationHandler}
    >
      <View className="flex-row justify-between p-4">
        <Text className="font-bold">{item.name}</Text>
        <ArrowForwardSVG height={24} width={24} />
      </View>

      <View className="px-4">
        <View className="my-1 flex-row items-center">
          <LocationSVG height={24} width={24} />
          <Text className="color-neutral-600">{item.startDate} - </Text>

          <Text className="color-neutral-600">{item.endDate}</Text>
        </View>

        <View className=" my-1 flex-row items-center ">
          <DoubleTakeAttendanceSVG height={24} width={24} />
          <Text className="color-neutral-600">{item.attendence}</Text>
        </View>
      </View>
    </Pressable>
  );
};

export default CurrentSeason;
