import React from 'react';
import { Pressable, Text, View } from '@/ui';
import { FillTakeAttendanceSVG } from '@/ui/icons/fill-take-attendance';
import { ArrowForwardSVG } from '@/ui/icons/arrow-forward';
import { TimeSVG } from '@/ui/icons/time';
import typography from '@/metrics/typography';
interface ToDoItem {
  id: number;
  title: string;
  date: string;
  navigation: string;
}

interface ToDoTaskProps {
  item: ToDoItem;
}
const ToDoTask: React.FC<ToDoTaskProps> = ({ item }) => {
  return (
    <View className="mb-0.5 w-full rounded-md  bg-white ">
      <Pressable className="flex-row items-center justify-between p-4">
        <View className="flex-row items-center">
          <FillTakeAttendanceSVG
            height={typography.iconSizes.md}
            width={typography.iconSizes.md}
          />
          <Text style={typography.style.heading}>{item.title}</Text>
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

export default ToDoTask;
