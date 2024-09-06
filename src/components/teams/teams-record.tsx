import { EvilIcons, FontAwesome, Ionicons } from '@expo/vector-icons';
import React from 'react';

import { colors, Pressable, Text, View } from '@/ui';

interface TeamItem {
  id: number;
  name: string;
  attendence: string;
  image: string;
  notes: string;
}

interface TeamProps {
  item: TeamItem;
}
const TeamsRecord: React.FC<TeamProps> = ({ item }) => {
  return (
    <View className="mb-4 w-full  rounded-sm bg-white">
      <Pressable
        // onPress={() => toggleTaskExpand(item.id)}
        className="flex-row justify-between p-4"
      >
        <Text className="font-bold">{item.name}</Text>
        {/* <Ionicons
          name="chevron-forward-sharp"
          size={24}
          color={colors.neutral[600]}
        /> */}
      </Pressable>

      <View className="flex-row justify-evenly px-4 pb-2 ">
        <View className="my-1 flex-row justify-between rounded-md border-2 border-primary-600 px-2 py-1 ">
          {/* <EvilIcons name="location" size={24} color={colors.neutral[600]} /> */}
          <Ionicons
            name="person-outline"
            size={24}
            color={colors.neutral[600]}
          />
          <Text className="color-neutral-600">{item.attendence}</Text>
        </View>
        <View className="my-1 flex-row justify-between rounded-md border-2 border-primary-600 px-2 py-1 ">
          <EvilIcons name="camera" size={24} color={colors.neutral[600]} />
          <Text className="color-neutral-600">{item.image}</Text>
        </View>

        <View className="my-1 flex-row justify-between rounded-md border-2 border-primary-600 px-2 py-1 ">
          <Text className="color-neutral-600">{item.notes} </Text>
          <FontAwesome name="soccer-ball-o" size={20} color="gray" />
        </View>

        {/* <View className="w-full border-b-2 border-b-gray-400" /> */}
      </View>
    </View>
  );
};

export default TeamsRecord;
