/* eslint-disable react-native/no-inline-styles */

import {
  AntDesign,
  EvilIcons,
  FontAwesome,
  Ionicons,
} from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import { useNavigation, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';

import { pastSessionData, sessionSingleData } from '@/data/data-base';
import { colors, Pressable, ScrollView, Text, View } from '@/ui';

import PastSession from '../../components/sessions/past-session';
import { Item } from '@/components/settings/item';
import UpComingSession from '@/components/sessions/upcoming-session';
import SessionsIndex from '@/components/common/sessionsIndex';

export default function Sessions() {
  const navigation = useNavigation();
  const router = useRouter();
  useEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: '#EEF0F8',
      },
    });
  }, [navigation]);
  const [sessionEvents, setEvents] = useState<string>('Past');

  const sessionEventHandler = (event: string) => {
    setEvents(event);
  };
  const [isPastPressed, setIsPastPressed] = useState<boolean>(true);
  const [isUpComingPressed, setIsUpComingPressed] = useState<boolean>(false);
  const [expandedSessionItem, setExpandedSessionItem] = useState<number | null>(
    null
  );
  const pastHandlePress = () => {
    setIsPastPressed(!isPastPressed);
    setIsUpComingPressed(false);
    sessionEventHandler('UpComing');
  };

  const upcomingHandlePress = () => {
    setIsUpComingPressed(!isUpComingPressed);
    setIsPastPressed(false);
    sessionEventHandler('Past');
  };
  const navigationHandler = (item: string) => {
    if (item === 'session-details') router.push('session-details');
    else if (item === 'team-season') router.push('team-season');
    else if (item === 'create-session') router.push('create-session');
  };
  return (
    <>
      <ScrollView className="flex-1 bg-[#EEF0F8]">
        <View className="ml-6">
          <Text className="my-3  text-2xl">Next Session</Text>
        </View>
        <View className="mx-6 flex-1 rounded-sm bg-[#EEF0F8]">
          <FlashList
            data={sessionSingleData}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <SessionsIndex item={item} />}
            estimatedItemSize={80}
            contentContainerStyle={{
              paddingVertical: 8,
            }}
          />
        </View>
        <View className="ml-6 w-[90%]  flex-row justify-between ">
          <Pressable
            className="w-[45%] justify-center  "
            onPress={() => {
              // sessionEventHandler('Past');
              pastHandlePress();
            }}
            style={{
              borderColor: isPastPressed ? '#004680' : 'null',
              borderBottomWidth: isPastPressed ? 2 : 0,
            }}
          >
            <Text className="my-3 self-center font-robotoBlackItalic text-xl text-[#004680]">
              Upcoming
            </Text>
          </Pressable>
          <Pressable
            className="w-[45%]  justify-center "
            onPress={() => {
              upcomingHandlePress();
            }}
            style={{
              borderColor: isUpComingPressed ? '#004680' : 'null',
              borderBottomWidth: isUpComingPressed ? 2 : 0,
            }}
          >
            <Text className="my-3 self-center font-sFDISPLAYREGULAR text-xl text-[#004680] ">
              Past
            </Text>
          </Pressable>
        </View>

        {sessionEvents === 'Past' && (
          <View className="mx-6 flex-1 rounded-sm bg-[#EEF0F8]">
            <FlashList
              data={pastSessionData}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => <PastSession item={item} />}
              estimatedItemSize={80}
              contentContainerStyle={{
                paddingVertical: 8,
              }}
              key={expandedSessionItem}
            />
          </View>
        )}
        {sessionEvents === 'UpComing' && (
          <View className="mx-6 flex-1 rounded-sm bg-[#EEF0F8]">
            <FlashList
              data={pastSessionData}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => <UpComingSession item={item} />}
              estimatedItemSize={80}
              contentContainerStyle={{
                paddingVertical: 8,
              }}
              key={expandedSessionItem}
            />
          </View>
        )}
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
        onPress={() => navigationHandler('create-session')}
      />
    </>
  );
}
