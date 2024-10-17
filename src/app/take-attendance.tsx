/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */

// import { Soccer } from '@/ui/icons/soccer';
import { useNavigation } from 'expo-router';
import React, { useEffect, useState } from 'react';
import CheckAttendence from '@/components/attendence/check-attendence';
import { sessionSingleData, takeAttendence } from '@/data/data-base';
import { ScrollView, TouchableOpacity, View, Text } from '@/ui';

import SessionsIndex from '@/components/common/sessionsIndex';
import { ActivityIndicator, FlatList } from 'react-native';
import { ArrowBackwardSVG } from '@/ui/icons/arrow-backward';
import { useGetCoachAttendanceQuery } from '@/redux/attendance/attendance-endpoints';
import { GetAttendanceAdapter } from '@/api/adaptars/attendance/attendance-adapter';
import type { GetAttendance } from '@/interfaces/entities/attendance/attendance-entities';
import type { RootState } from '@/redux/store';
import { useSelector } from 'react-redux';
import TakeAttendanceSubmitBtn from '@/components/buttons/Attendence/take-attendence-submit-btn';

const TakeAttendence = () => {
  const navigation = useNavigation();
  const currentSessions = useSelector(
    (state: RootState) => state.allSessions.currentSessions
  );
  const isLoadingAllSessions = useSelector(
    (state: RootState) => state.allSessions.isLoadingAllSessions
  );

  // const [attendanceList, setAttendanceList] = useState<GetAttendance[]>();
  ///////////////////// Get Attendance //////////////////////////
  const {
    data: attendances,
    isLoading: isLoadingAttendance,
    isError: isErrorAttendance,
  } = useGetCoachAttendanceQuery({
    teamSeasonId: 'a0qcX000000GEggQAG', // Your specific teamSeasonId
    sessionId: 'a0pcX0000004gn3QAA', // Your specific sessionId
  });
  const allCoachAttendances = attendances
    ? GetAttendanceAdapter.getSelectors().selectAll(attendances)
    : [];
  // useEffect(() => {
  //   console.log('allCoachAttendances: ', allCoachAttendances);

  //   // Update attendanceList when allCoachAttendances changes
  //   setAttendanceList(allCoachAttendances);
  // }, [attendances]);
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
          <ArrowBackwardSVG height={24} width={24} />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const [attendenceCount, setAttendenceCount] = useState<number>(0);
  const [studentAttendanceMark, setStudentsAttendanceMark] = useState<
    Array<{ AttendanceId: string; Attended: boolean }>
  >([]);

  return (
    <ScrollView className=" flex-1 bg-[#EEF0F8]">
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
              renderItem={({ item }) => (
                <SessionsIndex item={item} isNavigationAllowed={false} />
              )}
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
      <View className="mx-6 flex-1 rounded-sm bg-[#EEF0F8]">
        <FlatList
          data={allCoachAttendances}
          keyExtractor={(item) => item.AttendanceId}
          renderItem={({ item }) => (
            <CheckAttendence
              item={item}
              setAttendenceCount={setAttendenceCount}
              setStudentsAttendanceMark={setStudentsAttendanceMark}
            />
          )}
          contentContainerStyle={{
            paddingVertical: 8,
          }}
        />
      </View>
      <TakeAttendanceSubmitBtn
        item={{ attendenceCount, studentAttendanceMark }} // Use the correct property name
      />
    </ScrollView>
  );
};

export default TakeAttendence;
