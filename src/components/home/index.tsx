import { Ionicons } from '@expo/vector-icons';
import React from 'react';

import { colors, Pressable, Text, View } from '@/ui';
import { useRouter } from 'expo-router';

interface HomeItem {
  id: number;
  title: string;

  navigation: string;
}

interface HomeTaskProps {
  item: HomeItem;
}

const HomeTask: React.FC<HomeTaskProps> = ({ item }) => {
  const router = useRouter();

  const navigationHandler = () => {
    router.push(item.navigation);
  };

  return (
    <Pressable
      className="mb-0.5 w-full rounded-sm bg-white"
      onPress={navigationHandler}
    >
      <View className="flex-row justify-between p-4">
        <Text className="font-bold">{item.title}</Text>
        <Ionicons
          name="chevron-forward-sharp"
          size={24}
          color={colors.neutral[600]}
        />
      </View>
    </Pressable>
  );
};

export default HomeTask;
