import React from 'react';
import { colors, Pressable, ScrollView, Text, View } from '@/ui';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { DotsVerticalSVG } from '@/ui/icons/dots-vertical';
import typography from '@/metrics/typography';
interface SeasonStudentType {
  id: number;
  name: string;
}

interface SeasonStudentProps {
  item: SeasonStudentType;
}

const SeasonStudent: React.FC<SeasonStudentProps> = ({ item }) => {
  return (
    <View className="mb-0.5 w-full flex-row items-center justify-between rounded-sm bg-white p-2">
      <Text style={typography.style.heading}>{item.name}</Text>
      <DotsVerticalSVG
        height={typography.iconSizes.md}
        width={typography.iconSizes.md}
      />
    </View>
  );
};

export default SeasonStudent;
