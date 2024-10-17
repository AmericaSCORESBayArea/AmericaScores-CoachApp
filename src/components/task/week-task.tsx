import React from 'react';
import { Pressable, Text, View } from '@/ui';
import { useRouter } from 'expo-router';
import { ArrowForwardSVG } from '@/ui/icons/arrow-forward';
import { LocationSVG } from '@/ui/icons/location';
import { TimeSVG } from '@/ui/icons/time';

import typography from '@/metrics/typography';

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

  const navigationHandler = () => {
    router.push(item.navigation);
  };

  return (
    <Pressable
      className="mb-0.5 w-full rounded-sm bg-white"
      onPress={navigationHandler}
    >
      <View className="flex-row items-center justify-between p-4">
        {/* Title Text with responsive size */}
        <Text style={typography.style.heading}>{item.title}</Text>
        <ArrowForwardSVG
          height={typography.iconSizes.md}
          width={typography.iconSizes.md}
        />
      </View>

      <View className="px-4">
        <View className="my-1 flex-row items-center">
          <LocationSVG
            height={typography.iconSizes.md}
            width={typography.iconSizes.md}
          />
          {/* Location Text with responsive size */}
          <Text style={typography.style.subHeadingLarge}>{item.location}</Text>
        </View>

        <View className="my-1 flex-row items-center">
          <TimeSVG
            height={typography.iconSizes.md}
            width={typography.iconSizes.md}
          />
          {/* Date Text with responsive size */}
          <Text style={typography.style.subHeadingLarge}>Due: {item.date}</Text>
        </View>
      </View>
    </Pressable>
  );
};

export default WeekTask;
