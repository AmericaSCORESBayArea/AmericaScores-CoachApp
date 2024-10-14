import React from 'react';
import { Pressable, Text, View } from '@/ui';
import { useRouter } from 'expo-router';
import { ArrowForwardSVG } from '@/ui/icons/arrow-forward';
import { LocationSVG } from '@/ui/icons/location';
import { TimeSVG } from '@/ui/icons/time';
import { Dimensions } from 'react-native';

interface WeekItem {
  id: number;
  title: string;
  location: string;
  date: string;
  navigation: string;
}

interface WeekTaskProps {
  item: WeekItem;
}

const WeekTask: React.FC<WeekTaskProps> = ({ item }) => {
  const router = useRouter();
  const { width } = Dimensions.get('window');
  const isTablet = width >= 768;

  // Define constants for icon size and text sizes based on device type
  const iconSize = isTablet ? 30 : 24;
  const titleTextSize = isTablet ? 'text-4xl' : 'text-lg';
  const contentTextSize = isTablet ? 'text-3xl' : 'text-sm';

  const navigationHandler = () => {
    router.push(item.navigation);
  };

  return (
    <Pressable
      className="mb-0.5 w-full rounded-sm bg-white"
      onPress={navigationHandler}
    >
      <View className="flex-row justify-between p-4">
        {/* Title Text with responsive size */}
        <Text className={`font-bold ${titleTextSize}`}>{item.title}</Text>
        <ArrowForwardSVG height={iconSize} width={iconSize} />
      </View>

      <View className="px-4">
        <View className="my-1 flex-row">
          <LocationSVG height={iconSize} width={iconSize} />
          {/* Location Text with responsive size */}
          <Text className={`color-neutral-600 ${contentTextSize}`}>
            {item.location}
          </Text>
        </View>

        <View className="my-1 flex-row">
          <TimeSVG height={iconSize} width={iconSize} />
          {/* Date Text with responsive size */}
          <Text className={`color-neutral-600 ${contentTextSize}`}>
            Due: {item.date}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

export default WeekTask;
