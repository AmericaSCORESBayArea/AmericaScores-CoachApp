import React from 'react';
import { Pressable, Text, View } from '@/ui';
import { useRouter } from 'expo-router';
import { ArrowForwardSVG } from '@/ui/icons/arrow-forward';

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
        <ArrowForwardSVG height={24} width={24} />
      </View>
    </Pressable>
  );
};

export default HomeTask;
