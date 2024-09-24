/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import { View, Text, TouchableOpacity } from 'react-native';
import React, { useEffect } from 'react';
import { useNavigation } from 'expo-router';
import {
  Ionicons,
  EvilIcons,
  FontAwesome,
  AntDesign,
} from '@expo/vector-icons';
import {
  pastTaskData,
  sessionSingleData,
  toDoTaskData,
} from '@/data/data-base';
import { colors, ScrollView } from '@/ui';
import ToDoTask from '@/components/sessionDetails/to-do-task';
import { FlashList } from '@shopify/flash-list';
import PastTask from '@/components/sessionDetails/past-task';

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
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);
  return (
    <>
      <ScrollView className="flex-1 bg-[#EEF0F8]">
        <View className=" mx-6  w-[90%] justify-center rounded-sm bg-white">
          <View
            // onPress={() => toggleSessionExpand(item.id)}
            className="flex-row justify-between p-4"
          >
            <Text className="font-bold">{sessionSingleData[0].title}</Text>
            {/* <Ionicons
              name="chevron-forward-sharp"
              size={18}
              color={colors.neutral[600]}
            /> */}
          </View>
          <View className="px-4">
            <View className="my-1 flex-row">
              <EvilIcons
                name="location"
                size={24}
                color={colors.neutral[600]}
              />
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
        {/* <View className="mx-6 flex-1 rounded-sm bg-[#EEF0F8]">
        <FlashList
          data={sessionData}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <HomeTask
              item={item}
              expandedSessionItem={expandedSessionItem}
              toggleSessionExpand={toggleSessionExpand}
            />
          )}
          estimatedItemSize={80}
          contentContainerStyle={{
            paddingVertical: 8,
          }}
         
        />
      </View> */}

        <View className="ml-6">
          <Text className="my-3 text-base font-[800] text-[#737373]  ">
            To Do
          </Text>
        </View>
        <View className="mx-6 flex-1 rounded-sm bg-[#EEF0F8]">
          <FlashList
            data={toDoTaskData}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <ToDoTask item={item} />}
            estimatedItemSize={80}
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
          <FlashList
            data={pastTaskData}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <PastTask item={item} />}
            estimatedItemSize={80}
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
