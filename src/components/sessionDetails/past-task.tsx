import React from 'react';
import { Pressable, Text, View } from '@/ui';
import { FillRecordVideoSVG } from '@/ui/icons/fill-record-video';
import { ArrowForwardSVG } from '@/ui/icons/arrow-forward';
import { TimeSVG } from '@/ui/icons/time';
import { FillRecordPacerSVG } from '@/ui/icons/fill-record-pacer';
import typography from '@/metrics/typography';

interface PastItem {
  id: number;
  title: string;
  date: string;
  navigation: string;
}

interface PastTaskProps {
  item: PastItem;
}
const PastTask: React.FC<PastTaskProps> = ({ item }) => {
  return (
    <View className="mb-0.5 w-full rounded-md  bg-white ">
      <Pressable className="flex-row items-center justify-between p-4">
        <View className="flex-row ">
          {item.title === 'Record a Video' && (
            <FillRecordVideoSVG
              height={typography.iconSizes.md}
              width={typography.iconSizes.md}
            />
          )}
          {item.title === 'Record Pacer Score' && (
            <FillRecordPacerSVG
              height={typography.iconSizes.md}
              width={typography.iconSizes.md}
            />
          )}
          <Text className="ml-3 font-bold">{item.title}</Text>
        </View>
        <ArrowForwardSVG
          height={typography.iconSizes.md}
          width={typography.iconSizes.md}
        />
      </Pressable>

      <View className="px-4">
        <View className="my-1 flex-row items-center">
          <TimeSVG
            height={typography.iconSizes.md}
            width={typography.iconSizes.md}
          />
          <Text style={typography.style.subHeading}>Due: {item.date}</Text>
        </View>
      </View>
    </View>
  );
};

export default PastTask;
