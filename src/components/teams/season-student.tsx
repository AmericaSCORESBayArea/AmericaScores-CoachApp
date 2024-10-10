import React from 'react';
import { colors, Pressable, ScrollView, Text, View } from '@/ui';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { DotsVerticalSVG } from '@/ui/icons/dots-vertical';
interface SeasonStudentType {
  id: number;
  name: string;
}

interface SeasonStudentProps {
  item: SeasonStudentType;
}

const SeasonStudent: React.FC<SeasonStudentProps> = ({ item }) => {
  return (
    <View className="mb-0.5 w-full flex-row justify-between rounded-sm bg-white p-4">
      <Text>{item.name}</Text>
      <DotsVerticalSVG height={24} width={24} />
    </View>
  );
};

export default SeasonStudent;
