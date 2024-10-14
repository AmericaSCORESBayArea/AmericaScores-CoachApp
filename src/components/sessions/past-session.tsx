import React from 'react';
import { Pressable, Text, View } from '@/ui';
import { useRouter } from 'expo-router';
import { ArrowForwardSVG } from '@/ui/icons/arrow-forward';
import { LocationSVG } from '@/ui/icons/location';
import { TimeSVG } from '@/ui/icons/time';
import { DoubleTakeAttendanceSVG } from '@/ui/icons/double-take-attendance';
import { SoccerSVG } from '@/ui/icons/soccer';
import { Dimensions } from 'react-native';

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

  // Determine if the device is a tablet or mobile based on width
  const { width } = Dimensions.get('window');
  const isTablet = width >= 768;

  // Set dynamic sizes
  const iconSize = isTablet ? 40 : 24;
  const titleTextSize = isTablet ? 'text-4xl' : 'text-lg';
  const contentTextSize = isTablet ? 'text-3xl' : 'text-sm';

  const navigationHandler = () => {
    router.push(item.navigation);
  };

  return (
    <Pressable
      className="my-2 w-full rounded-sm bg-white"
      onPress={navigationHandler}
    >
      {/* Title with dynamic font size */}
      <View className="flex-row justify-between p-4">
        <Text className={`font-bold ${titleTextSize}`}>{item.title}</Text>
        <ArrowForwardSVG height={iconSize} width={iconSize} />
      </View>

      <View className="px-4">
        {/* Location */}
        <View className="my-1 flex-row">
          <LocationSVG height={iconSize} width={iconSize} />
          <Text className={`ml-2 color-neutral-600 ${contentTextSize}`}>
            {item.location}
          </Text>
        </View>

        {/* Time */}
        <View className="my-1 flex-row">
          <TimeSVG height={iconSize} width={iconSize} />
          <Text className={`ml-2 color-neutral-600 ${contentTextSize}`}>
            {item.time}
          </Text>
        </View>

        {/* Attendance */}
        <View className="my-1 flex-row">
          <DoubleTakeAttendanceSVG height={iconSize} width={iconSize} />
          <Text className={`ml-2 color-neutral-600 ${contentTextSize}`}>
            {item.attendence}
          </Text>
        </View>

        {/* Hobbies */}
        <View className="my-1 flex-row">
          {item.hobby.map((hobby, index) => (
            <View
              key={index}
              className="mx-2 flex-row items-center rounded-2xl bg-slate-200 px-3"
            >
              <SoccerSVG height={iconSize} width={iconSize} />
              <Text className={`ml-2 color-neutral-600 ${contentTextSize}`}>
                {hobby}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </Pressable>
  );
};

export default PastSession;
