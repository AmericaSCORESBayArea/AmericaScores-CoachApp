import React from 'react';
import { Pressable, Text, View } from '@/ui';
import { useRouter } from 'expo-router';
import { ArrowForwardSVG } from '@/ui/icons/arrow-forward';
import { LocationSVG } from '@/ui/icons/location';
import { TimeSVG } from '@/ui/icons/time';
import typography from '@/metrics/typography'; // Ensure you have this file with typography settings

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

  const navigationHandler = () => {
    router.push(item.navigation);
  };

  return (
    <Pressable
      className="w-full rounded-sm bg-white"
      style={{
        marginBottom: typography.paddingSizes.xxs,
      }}
      onPress={navigationHandler}
    >
      {/* Title Section */}
      <View
        className="flex-row items-center justify-between "
        style={{ padding: typography.paddingSizes.md }}
      >
        <Text style={typography.style.heading}>{item.title}</Text>
        <ArrowForwardSVG
          height={typography.iconSizes.md}
          width={typography.iconSizes.md}
        />
      </View>

      {/* Location and Time Details */}
      <View className=" px-4">
        {/* Location */}
        <View className="my-1 flex-row items-center ">
          <LocationSVG
            height={typography.iconSizes.md}
            width={typography.iconSizes.md}
          />
          <Text style={typography.style.subHeadingLarge}>{item.location}</Text>
        </View>

        {/* Date/Time */}
        <View className="flex-row items-center ">
          <TimeSVG
            height={typography.iconSizes.md}
            width={typography.iconSizes.md}
          />
          <Text style={typography.style.subHeadingLarge}>Due: {item.date}</Text>
        </View>
      </View>
    </Pressable>
  );
};

export default SoonTask;
