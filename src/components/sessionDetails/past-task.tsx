import React from 'react';
import { Pressable, Text, View } from '@/ui';
import { FillRecordVideoSVG } from '@/ui/icons/fill-record-video';
import { ArrowForwardSVG } from '@/ui/icons/arrow-forward';
import { TimeSVG } from '@/ui/icons/time';
import { FillRecordPacerSVG } from '@/ui/icons/fill-record-pacer';

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
      <Pressable className="flex-row justify-between p-4">
        <View className="flex-row ">
          {item.title === 'Record a Video' && (
            <FillRecordVideoSVG height={24} width={24} />
          )}
          {item.title === 'Record Pacer Score' && (
            <FillRecordPacerSVG height={24} width={24} />
          )}
          <Text className="ml-3 font-bold">{item.title}</Text>
        </View>
        <ArrowForwardSVG height={24} width={24} />
      </Pressable>

      <View className="px-4">
        <View className="my-1 flex-row">
          <TimeSVG height={24} width={24} />
          <Text className="ml-3 color-neutral-600">Due: {item.date}</Text>
        </View>
      </View>
    </View>
  );
};

export default PastTask;
