import React from 'react';
import { Pressable, Text, View } from '@/ui';
import { useRouter } from 'expo-router';
import { ArrowForwardSVG } from '@/ui/icons/arrow-forward';
import { LocationSVG } from '@/ui/icons/location';
import { TimeSVG } from '@/ui/icons/time';
import { DoubleTakeAttendanceSVG } from '@/ui/icons/double-take-attendance';
import { SoccerSVG } from '@/ui/icons/soccer';

interface PastSessionItem {
  id: number;
  title: string;
  location: string;
  time: string;
  attendence: string;
  hobby: string[];
  navigation: string;
}

interface PastSessionTaskProps {
  item: PastSessionItem;
}

const PastSession: React.FC<PastSessionTaskProps> = ({ item }) => {
  const router = useRouter();
  const navigationHandler = () => {
    router.push(item.navigation);
  };
  return (
    <Pressable
      className="my-2 w-full rounded-sm  bg-white"
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
          <Text className="color-neutral-600">{item.time}</Text>
        </View>

        <View className="my-1 flex-row">
          <DoubleTakeAttendanceSVG height={24} width={24} />
          <Text className="color-neutral-600">{item.attendence}</Text>
        </View>

        <View className="my-1 flex-row">
          {item.hobby.map((hobby, index) => (
            <View
              key={index}
              className="mx-2 flex-row items-center rounded-2xl bg-slate-200 px-3"
            >
              <SoccerSVG height={24} width={24} />
              <Text className="ml-2 color-neutral-600">{hobby}</Text>
            </View>
          ))}
        </View>
      </View>
    </Pressable>
  );
};

export default PastSession;
