/* eslint-disable @typescript-eslint/no-shadow */
import { View, Text, Pressable } from 'react-native';
import React from 'react';
import { useRouter } from 'expo-router';
import { LocationSVG } from '@/ui/icons/location';
import { TimeSVG } from '@/ui/icons/time';
import { SoccerSVG } from '@/ui/icons/soccer';
import typography from '@/metrics/typography';

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
      className="w-full rounded-sm bg-white"
      style={{
        marginBottom: typography.paddingSizes.xxs,
      }}
      onPress={() => navigationHandler('session-details')}
    >
      {/* Title with dynamic font size */}
      <Pressable
        className="flex-row items-center justify-between "
        style={{ padding: typography.paddingSizes.md }}
        onPress={() => navigationHandler('team-season')}
      >
        <Text style={typography.style.heading}>{item.title}</Text>
      </Pressable>

      <View className="px-4">
        {/* Location */}
        <View className="my-1 flex-row items-center">
          <LocationSVG
            height={typography.iconSizes.md}
            width={typography.iconSizes.md}
          />
          <Text style={typography.style.subHeadingLarge}>{item.location}</Text>
        </View>

        {/* Time */}
        <View className="my-1 flex-row items-center">
          <TimeSVG
            height={typography.iconSizes.md}
            width={typography.iconSizes.md}
          />
          <Text style={typography.style.subHeadingLarge}>{item.time}</Text>
        </View>

        {/* Hobbies */}
        <View className="my-1 flex-row">
          {item.hobby.map((hobby, index) => (
            <View
              key={index}
              className="mx-2 flex-row items-center rounded-3xl bg-slate-200 px-3"
            >
              <SoccerSVG
                height={typography.iconSizes.md}
                width={typography.iconSizes.md}
              />
              <Text style={typography.style.subHeadingLarge}>{hobby}</Text>
            </View>
          ))}
        </View>
      </View>
    </Pressable>
  );
};

export default SessionsIndex;
