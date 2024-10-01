/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import React, { useEffect } from 'react';
import { useNavigation } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';
import {
  pastTaskData,
  sessionSingleData,
  toDoTaskData,
} from '@/data/data-base';
import { ScrollView } from '@/ui';
import ToDoTask from '@/components/sessionDetails/to-do-task';
import PastTask from '@/components/sessionDetails/past-task';
import SessionsIndex from '@/components/common/sessionsIndex';
import { ArrowBackwardSVG } from '@/ui/icons/arrow-backward';

const SessionDetails = () => {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: '#EEF0F8',
      },
      headerTitle: 'Session Details',
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.goBack()} className="mx-4">
          <ArrowBackwardSVG height={24} width={24} />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);
  return (
    <>
      <ScrollView className="flex-1 bg-[#EEF0F8]">
        <View className="mx-6 flex-1 rounded-sm bg-[#EEF0F8]">
          <FlatList
            data={sessionSingleData}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <SessionsIndex item={item} />}
            contentContainerStyle={{
              paddingVertical: 8,
            }}
          />
        </View>

        <View className="ml-6">
          <Text className="my-3 text-base font-[800] text-[#737373]  ">
            To Do
          </Text>
        </View>
        <View className="mx-6 flex-1 rounded-sm bg-[#EEF0F8]">
          <FlatList
            data={toDoTaskData}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <ToDoTask item={item} />}
            contentContainerStyle={{
              paddingVertical: 8,
            }}
            // key={expandedTaskItem}
          />
        </View>
        <View className="ml-6">
          <Text className="my-3 text-base font-[800] text-[#737373]  ">
            Past Task
          </Text>
        </View>
        <View className="mx-6 flex-1 rounded-sm bg-[#EEF0F8]">
          <FlatList
            data={pastTaskData}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <PastTask item={item} />}
            contentContainerStyle={{
              paddingVertical: 8,
            }}
            // key={expandedTaskItem}
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
      />
    </>
  );
};

export default SessionDetails;
