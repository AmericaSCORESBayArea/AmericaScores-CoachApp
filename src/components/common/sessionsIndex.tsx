/* eslint-disable @typescript-eslint/no-shadow */
import { View, Text, Pressable } from 'react-native';
import React from 'react';
import { useRouter } from 'expo-router';
import { LocationSVG } from '@/ui/icons/location';
import { TimeSVG } from '@/ui/icons/time';
import { SoccerSVG } from '@/ui/icons/soccer';
interface SessionItem {
  id: number;
  title: string;
  location: string;
  time: string;
  hobby: string[];
  navigation: string;
}
interface SessionProps {
  item: SessionItem;
}
const SessionsIndex: React.FC<SessionProps> = ({ item }) => {
  const router = useRouter();
  const navigationHandler = (item: string) => {
    if (item === 'session-details') {
      router.push('session-details');
    } else if (item === 'team-season') {
      router.push('team-season');
    }
  };
  return (
    <Pressable
      className="w-full justify-center rounded-sm bg-white"
      onPress={() => navigationHandler('session-details')}
    >
      <Pressable
        className="flex-row justify-between p-4"
        onPress={() => navigationHandler('team-season')}
      >
        <Text className="font-bold">{item.title}</Text>
      </Pressable>
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

export default SessionsIndex;
