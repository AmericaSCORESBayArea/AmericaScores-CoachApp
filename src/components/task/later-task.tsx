import React from 'react';
import { Pressable, Text, View } from '@/ui';
import { useRouter } from 'expo-router';
import { ArrowForwardSVG } from '@/ui/icons/arrow-forward';
import { LocationSVG } from '@/ui/icons/location';
import { TimeSVG } from '@/ui/icons/time';
import typography from '@/metrics/typography'; // Assuming you have a typography file

interface LaterItem {
  id: number;
  title: string;
  location: string;
  date: string;
  navigation: string;
}

interface LaterTaskProps {
  item: LaterItem;
}

const LaterTask: React.FC<LaterTaskProps> = ({ item }) => {
  const router = useRouter();

  const navigationHandler = () => {
    router.push(item.navigation);
  };

  return (
    <Pressable
      className="mb-0.5 w-full rounded-sm bg-white"
      onPress={navigationHandler}
    >
      <View className="flex-row justify-between p-4">
        {/* Title Text with responsive size from typography */}
        <Text
          className={`font-bold`}
          style={{ fontSize: typography.sizes.textXL }}
        >
          {item.title}
        </Text>
        <ArrowForwardSVG
          height={typography.iconSizes.md}
          width={typography.iconSizes.md}
        />
      </View>

      <View className="px-4">
        <View className="my-1 flex-row">
          <LocationSVG
            height={typography.iconSizes.md}
            width={typography.iconSizes.md}
          />
          {/* Location Text with responsive size from typography */}
          <Text
            className={`color-neutral-600`}
            style={{ fontSize: typography.sizes.textLarge }}
          >
            {item.location}
          </Text>
        </View>

        <View className="my-1 flex-row">
          <TimeSVG
            height={typography.iconSizes.md}
            width={typography.iconSizes.md}
          />
          {/* Date Text with responsive size from typography */}
          <Text
            className={`color-neutral-600`}
            style={{ fontSize: typography.sizes.textLarge }}
          >
            Due: {item.date}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

export default LaterTask;
