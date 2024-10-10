/* eslint-disable @typescript-eslint/no-shadow */
import { View, Text, Pressable, Dimensions } from 'react-native';
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

  // Determine if the device is a tablet or mobile based on width
  const { width } = Dimensions.get('window');
  const isTablet = width >= 768;

  // Set dynamic sizes
  const iconSize = isTablet ? 40 : 22;
  const titleTextSize = isTablet ? 'text-4xl' : 'text-lg';
  const contentTextSize = isTablet ? 'text-3xl' : 'text-sm';

  // Navigation handler
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
      {/* Title with dynamic font size */}
      <Pressable
        className="flex-row justify-between p-4"
        onPress={() => navigationHandler('team-season')}
      >
        <Text className={`font-bold ${titleTextSize}`}>{item.title}</Text>
      </Pressable>

      <View className="px-4">
        {/* Location */}
        <View className="my-1 flex-row items-center">
          <LocationSVG height={iconSize} width={iconSize} />
          <Text className={`${contentTextSize} ml-2 color-neutral-600`}>
            {item.location}
          </Text>
        </View>

        {/* Time */}
        <View className="my-1 flex-row items-center">
          <TimeSVG height={iconSize} width={iconSize} />
          <Text className={`${contentTextSize} ml-2 color-neutral-600`}>
            {item.time}
          </Text>
        </View>

        {/* Hobbies */}
        <View className="my-1 flex-row">
          {item.hobby.map((hobby, index) => (
            <View
              key={index}
              className="mx-2 flex-row items-center rounded-3xl bg-slate-200 px-3"
            >
              <SoccerSVG height={iconSize} width={iconSize} />
              <Text className={`ml-2 ${contentTextSize} color-neutral-600`}>
                {hobby}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </Pressable>
  );
};

export default SessionsIndex;
