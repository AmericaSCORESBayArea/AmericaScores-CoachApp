import React from 'react';
import { Pressable, Text, View } from '@/ui';
import { FillTakeAttendanceSVG } from '@/ui/icons/fill-take-attendance';
import { ArrowForwardSVG } from '@/ui/icons/arrow-forward';
import { TimeSVG } from '@/ui/icons/time';
import typography from '@/metrics/typography';

import { useRouter } from 'expo-router';

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
  const router = useRouter();
  const navigationHandler = (route: string) => {
    router.push(route);
  };
  return (
    <View className="mb-0.5 w-full rounded-md  bg-white ">
      <View className="flex-row items-center justify-between p-4">
        <Pressable
          className="flex-row items-center"
          onPress={() => navigationHandler('take-attendance')}
        >
          <FillTakeAttendanceSVG
            height={typography.iconSizes.md}
            width={typography.iconSizes.md}
          />
          <Text style={typography.style.heading}>{item.title}</Text>
        </Pressable>
        <ArrowForwardSVG
          height={typography.iconSizes.md}
          width={typography.iconSizes.md}
        />
      </View>

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
