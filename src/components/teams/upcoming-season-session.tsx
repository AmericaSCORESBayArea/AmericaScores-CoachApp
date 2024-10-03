import React from 'react';
import { Pressable, Text, View } from '@/ui';
import { LocationSVG } from '@/ui/icons/location';
import { TimeSVG } from '@/ui/icons/time';
import { SoccerSVG } from '@/ui/icons/soccer';

interface UpComingSeasonSessionType {
  id: number;
  title: string;
  location: string;
  time: string;
  hobby: string[];
  navigation: string;
}

interface UpComingSeasonSessionProps {
  item: UpComingSeasonSessionType;
}
const UpComingSeasonSession: React.FC<UpComingSeasonSessionProps> = ({
  item,
}) => {
  const navigationHandler = () => {};
  return (
    <Pressable
      className="my-2 w-full rounded-sm  bg-white"
      onPress={navigationHandler}
    >
      <View className="flex-row justify-between p-4">
        <Text className="font-bold">{item.title}</Text>
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

export default UpComingSeasonSession;
