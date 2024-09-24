import React from 'react';
import { colors, Pressable, ScrollView, Text, View } from '@/ui';
import { MaterialCommunityIcons } from '@expo/vector-icons';
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
      <MaterialCommunityIcons name="dots-vertical" size={24} color="black" />
    </View>
  );
};

export default SeasonStudent;
