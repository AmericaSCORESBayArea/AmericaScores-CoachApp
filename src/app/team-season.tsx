/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
import { useNavigation, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  pastSeasonSessionData,
  SeasonStudentData,
  upComingSeasonSessionData,
} from '@/data/data-base';
import { Pressable, ScrollView, Text, TouchableOpacity, View } from '@/ui';
import SeasonStudent from '@/components/teams/season-student';
import UpComingSeasonsSession from '@/components/teams/upcoming-season-session';
import PastSeasonSession from '@/components/teams/past-season-session';
import { FlatList } from 'react-native';
import { ArrowBackwardSVG } from '@/ui/icons/arrow-backward';

export default function TeamSeason() {
  const navigation = useNavigation();
  const router = useRouter();

  useEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: '#EEF0F8',
      },
      headerTitle: 'Developer Test Soccer Poets',
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.goBack()} className="mx-4">
          <ArrowBackwardSVG height={24} width={24} />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);
  const [sessionEvents, setEvents] = useState<string>('Sessions');

  const sessionEventHandler = (event: string) => {
    setEvents(event);
  };
  const [isSessionPressed, setIsSessionPressed] = useState<boolean>(true);
  const [isStudentPressed, setIsStudentPressed] = useState<boolean>(false);

  const sessionsHandlerPress = () => {
    setIsSessionPressed(!isSessionPressed);
    setIsStudentPressed(false);
    sessionEventHandler('Sessions');
  };

  const studentsHandlerPress = () => {
    setIsStudentPressed(!isStudentPressed);
    setIsSessionPressed(false);
    sessionEventHandler('Students');
  };

  return (
    <ScrollView className="flex-1 bg-[#EEF0F8]">
      <View className="ml-6 w-[90%]  flex-row justify-between ">
        <Pressable
          className="w-[45%] justify-center  "
          onPress={() => {
            // sessionEventHandler('Past');
            sessionsHandlerPress();
          }}
          style={{
            borderColor: isSessionPressed ? '#004680' : 'null',
            borderBottomWidth: isSessionPressed ? 2 : 0,
          }}
        >
          <Text className="my-3 self-center font-robotoBlackItalic text-xl text-[#004680]">
            Sessions
          </Text>
        </Pressable>
        <Pressable
          className="w-[45%]  justify-center "
          onPress={() => {
            studentsHandlerPress();
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

      {sessionEvents === 'Sessions' && (
        <>
          <View className="mx-6 flex-1 rounded-sm bg-[#EEF0F8]">
            <Text className="my-3 text-base font-[800] text-[#737373]  ">
              Upcoming
            </Text>
            <FlatList
              data={upComingSeasonSessionData}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => <UpComingSeasonsSession item={item} />}
              contentContainerStyle={{
                paddingVertical: 8,
              }}
            />
          </View>
          <View className="mx-6 flex-1 rounded-sm bg-[#EEF0F8]">
            <Text className="my-3 text-base font-[800] text-[#737373]  ">
              Past
            </Text>
            <FlatList
              data={pastSeasonSessionData}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => <PastSeasonSession item={item} />}
              contentContainerStyle={{
                paddingVertical: 8,
              }}
            />
          </View>
        </>
      )}
      {sessionEvents === 'Students' && (
        <View className="mx-6 flex-1 rounded-sm bg-[#EEF0F8]">
          <FlatList
            data={SeasonStudentData}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <SeasonStudent item={item} />}
          />
        </View>
      )}
    </ScrollView>
  );
}
