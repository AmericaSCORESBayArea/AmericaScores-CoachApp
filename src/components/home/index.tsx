/* eslint-disable unused-imports/no-unused-vars */
import { Ionicons } from '@expo/vector-icons';
import React from 'react';

import { colors, Text, View } from '@/ui';

interface HomeItem {
  id: number;
  title: string;
  location: string;
  time: string;
  hobby: string[];
}

interface HomeTaskProps {
  item: HomeItem;
  expandedSessionItem: number | null;
  toggleSessionExpand: (id: number) => void;
}

const HomeTask: React.FC<HomeTaskProps> = ({
  item,
  expandedSessionItem,
  toggleSessionExpand,
}) => {
  return (
    <View className="mb-0.5 w-full rounded-sm bg-white">
      <View
        // onPress={() => toggleSessionExpand(item.id)}
        className="flex-row justify-between p-4"
      >
        <Text className="font-bold">{item.title}</Text>
        <Ionicons
          name="chevron-forward-sharp"
          size={24}
          color={colors.neutral[600]}
        />
      </View>

      {/* {expandedSessionItem === item.id && (
        <View className="px-4">
          <View className="my-1 flex-row">
            <EvilIcons name="location" size={24} color={colors.neutral[600]} />
            <Text className="color-neutral-600">{item.location}</Text>
          </View>

          <View className="my-1 flex-row">
            <Ionicons
              name="time-outline"
              size={24}
              color={colors.neutral[600]}
            />
            <Text className="color-neutral-600">{item.time}</Text>
          </View>

          <View className="my-1 flex-row">
            {item.hobby.map((hobby, index) => (
              <View
                key={index}
                className="mx-2 flex-row items-center rounded-2xl bg-slate-200 px-3"
              >
                <FontAwesome
                  name="soccer-ball-o"
                  size={24}
                  color={colors.neutral[600]}
                />
                <Text className="ml-2 color-neutral-600">{hobby}</Text>
              </View>
            ))}
          </View>
        </View>
      )} */}
    </View>
  );
};

export default HomeTask;
