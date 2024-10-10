/* eslint-disable react-native/no-inline-styles */
import { useNavigation, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import LaterTask from '@/components/task/later-task';
import WeekTask from '@/components/task/week-task';
import { laterTaskData, weekTaskData } from '@/data/data-base';
import { ScrollView, Text, View } from '@/ui';
import { AntDesign } from '@expo/vector-icons';
import { FlatList } from 'react-native';

export default function Tasks() {
  const router = useRouter();

  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: '#EEF0F8',
      },
      headerTitle: '',
    });
  }, [navigation]);

  const navigationHandler = (item: string) => {
    if (item === 'create-personal-task') router.push('create-personal-task');
  };
  return (
    <>
      <ScrollView className="flex-1 bg-[#EEF0F8]">
        <View className="ml-6">
          <Text className="my-3 text-base font-[800] text-[#737373]  ">
            DUE THIS WEEK
          </Text>
        </View>
        <View className="mx-6 flex-1 rounded-sm bg-[#EEF0F8]">
          <FlatList
            data={weekTaskData}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <WeekTask item={item} />}
            contentContainerStyle={{
              paddingVertical: 8,
            }}
          />
        </View>
        <View className="ml-6">
          <Text className="my-3 text-base font-[800] text-[#737373]  ">
            LATER
          </Text>
        </View>
        <View className="mx-6 flex-1 rounded-sm bg-[#EEF0F8]">
          <FlatList
            data={laterTaskData}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <LaterTask item={item} />}
            contentContainerStyle={{
              paddingVertical: 8,
            }}
          />
        </View>
      </ScrollView>
      <AntDesign
        name="pluscircle"
        size={45}
        color="#004680"
        style={{
          position: 'absolute',
          bottom: 20, // Adjust the distance from the bottom
          right: 20, // Adjust the distance from the right
        }}
        onPress={() => navigationHandler('create-personal-task')}
      />
    </>
  );
}
