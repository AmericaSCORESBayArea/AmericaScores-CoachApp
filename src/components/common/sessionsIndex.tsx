import { View, Text, Pressable } from 'react-native';
import React from 'react';
import { sessionSingleData } from '@/data/data-base';
import { colors } from '@/ui';
import { EvilIcons, FontAwesome, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
interface SessionItem {
  id: number;
  title: string;
  location: string;
  time: string;
  hobby: string[];
  navigation: string;
}
interface SessionProps {
  item: SessionItem;
}
const SessionsIndex: React.FC<SessionProps> = ({ item }) => {
  const router = useRouter();
  const navigationHandler = (item: string) => {
    if (item === 'session-details') {
      router.push('session-details');
    } else if (item === 'team-season') {
      router.push('team-season');
    }
  };
  return (
    <Pressable
      className="w-full justify-center rounded-sm bg-white"
      onPress={() => navigationHandler('session-details')}
    >
      <Pressable
        // onPress={() => toggleSessionExpand(item.id)}
        className="flex-row justify-between p-4"
        onPress={() => navigationHandler('team-season')}
      >
        <Text className="font-bold">{item.title}</Text>
        {/* <Ionicons
            name="chevron-forward-sharp"
            size={18}
            color={colors.neutral[600]}
          /> */}
      </Pressable>
      <View className="px-4">
        <View className="my-1 flex-row">
          <EvilIcons name="location" size={24} color={colors.neutral[600]} />
          <Text className="color-neutral-600">{item.location}</Text>
        </View>

        <View className="my-1 flex-row">
          <Ionicons name="time-outline" size={24} color={colors.neutral[600]} />
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
    </Pressable>
  );
};

export default SessionsIndex;
