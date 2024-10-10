import React from 'react';
import { Pressable, Text, View } from '@/ui';
import { useRouter } from 'expo-router';
import { ArrowForwardSVG } from '@/ui/icons/arrow-forward';
import { LocationSVG } from '@/ui/icons/location';
import { TimeSVG } from '@/ui/icons/time';
import { Dimensions } from 'react-native';

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

  // Detect screen width to determine if the device is a tablet or mobile
  const { width } = Dimensions.get('window');
  const isTablet = width >= 768;

  // Set icon sizes based on device type
  const iconSize = isTablet ? 45 : 24;

  // Set text sizes based on device type
  const titleSize = isTablet ? 'text-4xl' : 'text-lg';
  const detailSize = isTablet ? 'text-2xl' : 'text-sm';

  const navigationHandler = () => {
    router.push(item.navigation);
  };

  return (
    <Pressable
      className="mb-0.5 w-full rounded-sm bg-white"
      onPress={navigationHandler}
    >
      {/* Title Section */}
      <View className="flex-row justify-between p-4">
        <Text className={`font-bold ${titleSize}`}>{item.title}</Text>
        <ArrowForwardSVG height={iconSize} width={iconSize} />
      </View>

      {/* Location and Time Details */}
      <View className="px-4">
        {/* Location */}
        <View className="my-1 flex-row items-center">
          <LocationSVG height={iconSize} width={iconSize} />
          <Text className={`ml-2 color-neutral-600 ${detailSize}`}>
            {item.location}
          </Text>
        </View>

        {/* Date/Time */}
        <View className="my-1 flex-row items-center">
          <TimeSVG height={iconSize} width={iconSize} />
          <Text className={`ml-2 color-neutral-600 ${detailSize}`}>
            Due: {item.date}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

export default SoonTask;
