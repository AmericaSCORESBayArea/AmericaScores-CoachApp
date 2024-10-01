import {
  EvilIcons,
  Feather,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from '@expo/vector-icons';
import React from 'react';

import { colors, Text, View } from '@/ui';

interface TaskItem {
  id: number;
  title: string;
  date: string;
  time: string;
  subTitle1: string;
  subTitle2: string;
  subTitle3: string;
}

interface IndexProps {
  item: TaskItem;
}

const Index: React.FC<IndexProps> = ({ item }) => {
  return (
    <View className="mb-4 w-full rounded-sm bg-white">
      <View
        // onPress={() => toggleSessionExpand(item.id)}
        className="flex-row justify-between p-4"
      >
        <View>
          <Text className="font-bold">{item.title}</Text>
          {/* <Ionicons
            name="chevron-forward-sharp"
            size={24}
            color={colors.neutral[600]}
          /> */}
        </View>
        <View>
          <Text className="color-neutral-600">Today {item.time}</Text>
        </View>
      </View>
      <View className="my-1 flex-row px-4 pb-4 ">
        <EvilIcons name="location" size={24} color={colors.neutral[600]} />
        <Text className="color-neutral-600">{item.date}</Text>
      </View>
      <View className="428 px-4">
        <View className="my-1 flex-row justify-between">
          <View className="flex-row">
            <MaterialIcons name="people-outline" size={24} color="black" />
            <Text className="color-neutral-600">{item.subTitle1}</Text>
          </View>
          <View>
            <Ionicons
              name="chevron-forward-sharp"
              size={24}
              color={colors.neutral[600]}
            />
          </View>
        </View>
        <View className="my-1 flex-row justify-between">
          <View className="flex-row">
            <MaterialCommunityIcons
              name="shoe-formal"
              size={24}
              color="black"
            />
            <Text className="color-neutral-600">{item.subTitle2}</Text>
          </View>
          <View>
            <Ionicons
              name="chevron-forward-sharp"
              size={24}
              color={colors.neutral[600]}
            />
          </View>
        </View>
        <View className="my-1 flex-row justify-between">
          <View className="flex-row">
            <Feather name="camera" size={24} color="black" />
            <Text className="color-neutral-600">{item.subTitle3}</Text>
          </View>
          <View>
            <Ionicons
              name="chevron-forward-sharp"
              size={24}
              color={colors.neutral[600]}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

export default Index;
