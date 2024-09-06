/* eslint-disable react-native/no-inline-styles */
/* eslint-disable unused-imports/no-unused-vars */
import {
  AntDesign,
  EvilIcons,
  FontAwesome,
  Ionicons,
} from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import { useNavigation } from 'expo-router';
import React, { useEffect, useState } from 'react';

import { pastSessionData, sessionSingleData } from '@/data/data-base';
import { colors, Pressable, ScrollView, Text, View } from '@/ui';

import PastSession from '../../components/sessions/past-session';

export default function Sessions() {
  const navigation = useNavigation();
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
    sessionEventHandler('Past');
  };

  const upcomingHandlePress = () => {
    setIsUpComingPressed(!isUpComingPressed);
    setIsPastPressed(false);
    sessionEventHandler('UpComing');
  };

  return (
    <>
      <ScrollView className="flex-1 bg-[#EEF0F8]">
        <View className="ml-6">
          <Text className="my-3  text-2xl">Next Session</Text>
        </View>
        <View className="mx-6 flex-1 rounded-sm bg-white">
          <View className="mb-2 w-full rounded-sm">
            <Pressable className="flex-row  justify-between p-4">
              <Text className="font-bold">{sessionSingleData[0].title}</Text>
              <Ionicons
                name="chevron-forward-sharp"
                size={24}
                color={colors.neutral[600]}
              />
            </Pressable>
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
                    className="mx-2 flex-row items-center rounded-2xl bg-[#EEF0F8] px-3"
                  >
                    <FontAwesome
                      name="soccer-ball-o"
                      size={24}
                      color={colors.neutral[600]}
                    />
                    <Text className="ml-2  color-neutral-600">{hobby}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
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
              renderItem={({ item }) => <PastSession item={item} />}
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
      />
    </>
  );
}
