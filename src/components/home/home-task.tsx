import React from 'react';
import { Pressable, Text, View } from '@/ui';
import { useRouter } from 'expo-router';
import { ArrowForwardSVG } from '@/ui/icons/arrow-forward';
import { Dimensions } from 'react-native';

interface HomeItem {
  id: number;
  title: string;
  navigation: string;
}

interface HomeTaskProps {
  item: HomeItem;
}

const HomeTask: React.FC<HomeTaskProps> = ({ item }) => {
  const router = useRouter();

  // Detect screen width to determine if the device is a tablet or mobile
  const { width } = Dimensions.get('window');
  const isTablet = width >= 768;

  // Set icon size based on device type
  const iconSize = isTablet ? 45 : 24;

  // Set text size based on device type
  const textSize = isTablet ? 'text-3xl' : 'text-lg';

  const navigationHandler = () => {
    router.push(item.navigation);
  };

  return (
    <Pressable
      className="mb-0.5 w-full rounded-sm bg-white"
      onPress={navigationHandler}
    >
      <View className="flex-row justify-between p-4">
        {/* Apply dynamic text size */}
        <Text className={`font-bold ${textSize}`}>{item.title}</Text>

        {/* Apply dynamic icon size */}
        <ArrowForwardSVG height={iconSize} width={iconSize} />
      </View>
    </Pressable>
  );
};

export default HomeTask;
