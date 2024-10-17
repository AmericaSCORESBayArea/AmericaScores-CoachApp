import React from 'react';
import { Pressable, Text, View } from '@/ui';
import { useRouter } from 'expo-router';
import { ArrowForwardSVG } from '@/ui/icons/arrow-forward';

import typography from '@/metrics/typography';

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

  const navigationHandler = () => {
    router.push(item.navigation);
  };

  return (
    <Pressable
      className="mb-0.5 w-full rounded-sm bg-white"
      onPress={navigationHandler}
    >
      <View className="flex-row items-center justify-between p-4">
        {/* Apply dynamic text size */}
        <Text style={typography.style.heading}>{item.title}</Text>

        {/* Apply dynamic icon size */}
        <ArrowForwardSVG
          height={typography.iconSizes.md}
          width={typography.iconSizes.md}
        />
      </View>
    </Pressable>
  );
};

export default HomeTask;
