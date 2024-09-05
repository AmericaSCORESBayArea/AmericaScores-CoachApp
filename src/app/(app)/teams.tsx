/* eslint-disable react-native/no-inline-styles */
/* eslint-disable unused-imports/no-unused-vars */
import { FlashList } from '@shopify/flash-list';
import { useNavigation } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView } from 'react-native-gesture-handler';

import StudentsRecord from '@/components/teams/students-record';
import TeamsRecord from '@/components/teams/teams-record';
import { studentRecordData } from '@/data/data-base';
import { Pressable, Text, View } from '@/ui';

export default function Teams() {
  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: '#EEF0F8',
      },
      headerTitle: '',
    });
  }, [navigation]);
  const [sessionEvents, setEvents] = useState<string>('Team');

  const sessionEventHandler = (event: string) => {
    setEvents(event);
  };
  const [isTeamPressed, setIsTeamPressed] = useState<boolean>(true);
  const [isStudentPressed, setIsStudentPressed] = useState<boolean>(false);
  const [expandedSessionItem, setExpandedSessionItem] = useState<number | null>(
    null
  );
  const TeamHandlePress = () => {
    setIsTeamPressed(!isTeamPressed);
    setIsStudentPressed(false);
    sessionEventHandler('Team');
  };

  const StudentHandlePress = () => {
    setIsStudentPressed(!isStudentPressed);
    setIsTeamPressed(false);
    sessionEventHandler('Student');
  };
  return (
    <ScrollView className="flex-1 bg-[#EEF0F8]">
      <View className="ml-6 ">
        <Text className="my-3  self-center text-lg font-bold">
          Mission Gardens Selecta 2024-2025
        </Text>
      </View>
      <View className="ml-6 w-[90%]  flex-row justify-between ">
        <Pressable
          className="w-[45%] justify-center  "
          onPress={() => {
            // sessionEventHandler('Team');
            TeamHandlePress();
          }}
          style={{
            borderColor: isTeamPressed ? '#004680' : 'null',
            borderBottomWidth: isTeamPressed ? 2 : 0,
          }}
        >
          <Text className="my-3 self-center font-robotoBlackItalic text-xl text-[#004680]">
            Teams
          </Text>
        </Pressable>
        <Pressable
          className="w-[45%]  justify-center "
          onPress={() => {
            StudentHandlePress();
          }}
          style={{
            borderColor: isStudentPressed ? '#004680' : 'null',
            borderBottomWidth: isStudentPressed ? 2 : 0,
          }}
        >
          <Text className="my-3 self-center font-sFDISPLAYREGULAR text-xl text-[#004680] ">
            Students
          </Text>
        </Pressable>
      </View>

      {sessionEvents === 'Team' && (
        <View className="mx-6 flex-1 rounded-sm bg-[#EEF0F8]">
          <FlashList
            data={studentRecordData}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <TeamsRecord item={item} />}
            estimatedItemSize={80}
            contentContainerStyle={{
              paddingVertical: 8,
            }}
            key={expandedSessionItem}
          />
        </View>
      )}
      {sessionEvents === 'Student' && (
        <View className="mx-6 flex-1 rounded-sm bg-[#EEF0F8] ">
          <FlashList
            data={studentRecordData}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <StudentsRecord item={item} />}
            estimatedItemSize={80}
            contentContainerStyle={{
              paddingVertical: 8,
            }}
            key={expandedSessionItem}
          />
        </View>
      )}
    </ScrollView>
  );
}
