import React from 'react';
import { Pressable, Text, View } from '@/ui';
import { FillTakeAttendanceSVG } from '@/ui/icons/fill-take-attendance';
import { ArrowForwardSVG } from '@/ui/icons/arrow-forward';
import { TimeSVG } from '@/ui/icons/time';
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
      <Pressable className="flex-row justify-between p-4">
        <View className="flex-row ">
          <FillTakeAttendanceSVG height={24} width={24} />
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

export default ToDoTask;
