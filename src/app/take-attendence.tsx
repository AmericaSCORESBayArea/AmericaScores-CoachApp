/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */

// import { Soccer } from '@/ui/icons/soccer';
import { EvilIcons, FontAwesome, Ionicons } from '@expo/vector-icons';

import { useNavigation } from 'expo-router';
import React, { useEffect, useState } from 'react';

import CheckAttendence from '@/components/attendence/check-attendence';
import { sessionSingleData, takeAttendence } from '@/data/data-base';
import {
  colors,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from '@/ui';
import TakeAttendenceSubmitBtn from '@/components/buttons/Attendence/take-attendence-submit-btn';
import SessionsIndex from '@/components/common/sessionsIndex';
import { FlatList } from 'react-native';

const TakeAttendence = () => {
  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: '#EEF0F8',
        borderBottomWidth: 0, // Ensures the bottom border is hidden
        elevation: 0, // For Android: hides the shadow and line
        shadowOpacity: 0, // For iOS: hides the shadow and line
      },
      headerTitle: 'Take Attendence',
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.goBack()} className="mx-4">
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const [attendenceCount, setAttendenceCount] = useState<number>(0);

  return (
    <ScrollView className=" flex-1 bg-[#EEF0F8]">
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
      <View className="mx-6 flex-1 rounded-sm bg-[#EEF0F8]">
        <FlatList
          data={takeAttendence}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <CheckAttendence
              item={item}
              setAttendenceCount={setAttendenceCount}
            />
          )}
          contentContainerStyle={{
            paddingVertical: 8,
          }}
        />
      </View>
      <TakeAttendenceSubmitBtn item={{ attendenceCount }} />
    </ScrollView>
  );
};

export default TakeAttendence;
