/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable unused-imports/no-unused-vars */
// import { Soccer } from '@/ui/icons/soccer';
import { EvilIcons, FontAwesome, Ionicons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import { useNavigation } from 'expo-router';
import React, { useEffect, useState } from 'react';

import CheckAttendence from '@/components/home/check-attendence';
import { sessionSingleData, takeAttendence } from '@/data/data-base';
import { colors, ScrollView, Text, View } from '@/ui';

const attendence = () => {
  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: '#EEF0F8',
      },
      headerTitle: 'Take Attendence',
    });
  }, [navigation]);
  // const [expandedTaskItem, setExpandedTaskItem] = useState<number | null>(null);
  const [expandedSessionItem, setExpandedSessionItem] = useState<number | null>(
    null
  );

  const toggleSessionExpand = (id: number) => {
    setExpandedSessionItem((prev) => (prev === id ? null : id));
  };
  return (
    <ScrollView className="flex-1 bg-[#EEF0F8]">
      <View className=" mx-6  w-[90%] justify-center rounded-sm bg-white">
        <View
          // onPress={() => toggleSessionExpand(item.id)}
          className="flex-row justify-between p-4"
        >
          <Text className="font-bold">{sessionSingleData[0].title}</Text>
          <Ionicons
            name="chevron-forward-sharp"
            size={18}
            color={colors.neutral[600]}
          />
        </View>
        <View className="px-4">
          <View className="my-1 flex-row">
            <EvilIcons name="location" size={24} color={colors.neutral[600]} />
            <Text className="color-neutral-600">
              {sessionSingleData[0].location}
            </Text>
          </View>

          <View className="my-1 flex-row">
            <Ionicons
              name="time-outline"
              size={24}
              color={colors.neutral[600]}
            />
            <Text className="color-neutral-600">
              {sessionSingleData[0].time}
            </Text>
          </View>

          <View className="my-1 flex-row">
            {sessionSingleData[0].hobby.map((hobby, index) => (
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
      </View>
      <View className="mx-6 flex-1 rounded-sm bg-[#EEF0F8]">
        <FlashList
          data={takeAttendence}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <CheckAttendence item={item} />}
          estimatedItemSize={80}
          contentContainerStyle={{
            paddingVertical: 8,
          }}
          key={expandedSessionItem}
        />
      </View>
    </ScrollView>
  );
};

export default attendence;
