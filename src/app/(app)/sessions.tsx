/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation, useRouter } from 'expo-router';
import { Pressable, ScrollView, Text, View } from '@/ui';
import { Dimensions } from 'react-native'; // Import Dimensions API
import PastSession from '../../components/sessions/past-session';
import UpComingSession from '@/components/sessions/upcoming-session';
import SessionsIndex from '@/components/common/sessionsIndex';
import { FlatList } from 'react-native';
import { pastSessionData, sessionSingleData } from '@/data/data-base';

export default function Sessions() {
  const navigation = useNavigation();
  const router = useRouter();

  const { width } = Dimensions.get('window'); // Get screen width
  const isTablet = width >= 768; // Define tablet based on width

  useEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: '#EEF0F8',
      },
    });
  }, [navigation]);

  const [sessionEvents, setEvents] = useState<string>('Upcoming');
  const [isPastPressed, setIsPastPressed] = useState<boolean>(false);
  const [isUpComingPressed, setIsUpComingPressed] = useState<boolean>(true);

  const sessionEventHandler = (event: string) => {
    setEvents(event);
  };

  const pastHandlePress = () => {
    setIsPastPressed(true);
    setIsUpComingPressed(false);
    sessionEventHandler('Past');
  };

  const upcomingHandlePress = () => {
    setIsUpComingPressed(true);
    setIsPastPressed(false);
    sessionEventHandler('Upcoming');
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
          <Text
            className="my-3 text-2xl"
            style={{
              fontSize: isTablet ? 40 : 16,
              paddingVertical: isTablet ? 20 : 5,
            }}
          >
            Next Session
          </Text>
        </View>

        <View className="mx-6 rounded-sm bg-[#EEF0F8]">
          <FlatList
            data={sessionSingleData}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <SessionsIndex item={item} />}
            contentContainerStyle={{ paddingVertical: 8 }}
          />
        </View>

        <View className="ml-6 w-[90%] flex-row justify-between ">
          <Pressable
            className="w-[45%] justify-center"
            onPress={upcomingHandlePress}
            style={{
              borderColor: isUpComingPressed ? '#004680' : 'null',
              borderBottomWidth: isUpComingPressed ? 2 : 0,
            }}
          >
            <Text
              className="my-3 self-center font-robotoBlackItalic text-[#004680]"
              style={{
                fontSize: isTablet ? 40 : 16,
                paddingVertical: isTablet ? 20 : 5, // Adjust text size for tablet or mobile
              }}
            >
              Upcoming
            </Text>
          </Pressable>

          <Pressable
            className="w-[45%] justify-center"
            onPress={pastHandlePress}
            style={{
              borderColor: isPastPressed ? '#004680' : 'null',
              borderBottomWidth: isPastPressed ? 2 : 0,
            }}
          >
            <Text
              className="my-3 self-center font-sFDISPLAYREGULAR text-[#004680]"
              style={{
                fontSize: isTablet ? 40 : 16, // Adjust text size for tablet or mobile
                paddingVertical: isTablet ? 20 : 5,
              }}
            >
              Past
            </Text>
          </Pressable>
        </View>

        {sessionEvents === 'Past' && (
          <View className="mx-6 flex-1 rounded-sm bg-[#EEF0F8]">
            <FlatList
              data={pastSessionData}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => <PastSession item={item} />}
              contentContainerStyle={{ paddingVertical: 8 }}
            />
          </View>
        )}

        {sessionEvents === 'Upcoming' && (
          <View className="mx-6 flex-1 rounded-sm bg-[#EEF0F8]">
            <FlatList
              data={pastSessionData}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => <UpComingSession item={item} />}
              contentContainerStyle={{ paddingVertical: 8 }}
            />
          </View>
        )}
      </ScrollView>

      <AntDesign
        name="pluscircle"
        size={isTablet ? 80 : 40}
        color="#004680"
        style={{
          position: 'absolute',
          bottom: 20,
          right: 20,
        }}
        onPress={() => navigationHandler('create-session')}
      />
    </>
  );
}
