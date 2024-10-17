/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
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

import { useSelector } from 'react-redux';
import type { RootState } from '@/redux/store';

const SessionDetails = () => {
  const navigation = useNavigation();
  const currentSessions = useSelector(
    (state: RootState) => state.allSessions.currentSessions
  );
  const isLoadingAllSessions = useSelector(
    (state: RootState) => state.allSessions.isLoadingAllSessions
  );

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
          <>
            {isLoadingAllSessions ? (
              <View className="mt-5">
                <ActivityIndicator size="small" color={'#000000'} />
              </View>
            ) : currentSessions && currentSessions.length > 0 ? ( // Check if currentSessions exist and are not empty
              <FlatList
                data={currentSessions}
                keyExtractor={(item) => item.SessionId}
                renderItem={({ item }) => <SessionsIndex item={item} />}
                contentContainerStyle={{
                  paddingVertical: 8,
                }}
              />
            ) : (
              // Show message when no sessions are available
              <View className="my-10 items-center justify-center">
                <Text>No Current Session Available</Text>
              </View>
            )}
          </>
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
