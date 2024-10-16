/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import { useNavigation, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import HomeTask from '@/components/home/home-task';
import SoonTask from '@/components/home/soon-task';
import { sessionData, sessionSingleData, soonTaskData } from '@/data/data-base';
import { ScrollView, Text, View } from '@/ui';
import { useGetCoachRegionsQuery } from '@/redux/regions/regions-endpoints';
import { GetRegionAdapter } from '@/api/adaptars/regions/region-adapter';
import { useGetTeamSeasonQuery } from '@/redux/teamseason/team-season-endpoints';
import { GetTeamSeasonsAdapter } from '@/api/adaptars/teamSeason/teamseason-adapter';
import {
  useCreateCoachSessionMutation,
  useDeleteCoachSessionIdMutation,
  useGetCoachAllSessionsQuery,
  useGetCoachSessionIdQuery,
  useUpdateCoachSessionIdMutation,
} from '@/redux/sessions/sessions-endpoint';
import {
  GetSessionsAdapter,
  GetSessionsIdAdapter,
} from '@/api/adaptars/sessions/session-adapter';
import SessionsIndex from '@/components/common/sessionsIndex';
import {
  useCreateCoachEnrollmentsMutation,
  useDeleteCoachEnrollmentsMutation,
  useGetCoachEnrollmentsIdQuery,
  useGetCoachEnrollmentsQuery,
  useUpdateCoachEnrollmentsIdMutation,
} from '@/redux/enrollments/enrollments-endpoints';
import {
  GetEnrollmentsAdapter,
  GetEnrollmentsIdAdapter,
} from '@/api/adaptars/enrollments/enrollments-adapter';
import { FlatList } from 'react-native';
import { getItem } from '@/core/storage';
import typography from '@/metrics/typography';
import {
  useCreateCoachAttendanceMutation,
  useGetCoachAttendanceQuery,
  usePatchCoachAttendanceMutation,
} from '@/redux/attendance/attendance-endpoints';
import { GetAttendanceAdapter } from '@/api/adaptars/attendance/attendance-adapter';
interface SessionPostType {
  SessionDate: string;
  SessionTopic: string;
  TeamSeasonId: string;
}

// eslint-disable-next-line max-lines-per-function
export default function Feed() {
  const [user, setUser] = useState<any>(null);
  const navigation = useNavigation();
  const router = useRouter();

  useEffect(() => {
    // handleCreateSession();
    navigation.setOptions({
      headerStyle: {
        backgroundColor: '#EEF0F8',
      },
      headerTitle: '',
    });
  }, [navigation]);

  useEffect(() => {
    async function fetchUser() {
      const userFromStorage = await getItem('user');
      setUser(userFromStorage);
      userFromStorage ? null : router.push('/login');
    }

    fetchUser();
  }, [router]);

  ////////////////////////// API WORKING  //////////////////////////////////
  const {
    data: regions,
    isLoading: isLoadingRegions,
    isError: isErrorRegions,
  } = useGetCoachRegionsQuery({ coachId: '003UQ00000EiAy9YAF' });
  const {
    data: teams,
    isLoading: isLoadingTeams,
    isError: isErrorTeams,
  } = useGetTeamSeasonQuery();
  const {
    data: Allsessions,
    isLoading: isLoadingSessions,
    isError: isErrorSession,
  } = useGetCoachAllSessionsQuery({
    regions: `'San Francisco Crocker','San Francisco Civic Center'`, // Update to regions
    startDate: '2018-08-01', // Adjust to the relevant date range
    endDate: '2026-06-21', // Use the relevant end date
    limit: 30, // Optional, can be omitted
    offset: 0, // Optional, can be omitted
  });

  const {
    data: sessionsId,
    isLoading: isLoadingSessionsId,
    isError: isErrorSessionId,
  } = useGetCoachSessionIdQuery({
    sessionId: 'a0pcX0000004gv7QAA',
  });
  const {
    data: enrollments,
    isLoading: isLoadingEnrollments,
    isError: isErrorEnrollments,
  } = useGetCoachEnrollmentsQuery({
    teamSeasonId: 'a0qcX000000GEggQAG',
  });
  const {
    data: enrollmentsId,
    isLoading: isLoadingEnrollmentsId,
    isError: isErrorEnrollmentsId,
  } = useGetCoachEnrollmentsIdQuery({
    enrollmentId: 'a0m1T000008KwXkQAK',
  });
  ///////////////////// Post Session//////////////////////////
  const [
    createCoachSession,
    { isLoading: isLoadingPostSession, error: isErrorPostSession },
  ] = useCreateCoachSessionMutation();

  const handleCreateSession = async () => {
    try {
      const sessionData: SessionPostType = {
        SessionDate: '2024-08-23',
        SessionTopic: 'Soccer',
        TeamSeasonId: 'a0qcX000000GEggQAG',
      };

      const response = await createCoachSession(sessionData).unwrap();
      console.log('response :', response);
    } catch (err) {
      console.error('Failed to create session:', err);
    }
  };
  ///////////////////// Patch SessionId//////////////////////////
  const [
    updateCoachSession,
    { isLoading: isLoadingUpdateSession, error: isErrorUpdateSession },
  ] = useUpdateCoachSessionIdMutation();

  const handleUpdateSession = async () => {
    try {
      const sessionPatchData = {
        SessionId: 'a0pcX0000004eQHQAY',
        SessionName: 'New Soccer Session',
        SessionDate: '2024-08-23',
        SessionTopic: 'Soccer',
        TeamSeasonId: 'a0qcX000000GEggQAG',
        Headcount: 20,
        FemaleHeadcount: 8,
      };

      const response = await updateCoachSession(sessionPatchData).unwrap();
      console.log('Updated session response: ', response);
    } catch (err) {
      console.error('Failed to update session:', err);
    }
  };

  ///////////////////// Delete SessionId//////////////////////////

  const [deleteCoachSession, { isLoading: isDeleting, error: deleteError }] =
    useDeleteCoachSessionIdMutation();

  const handleDeleteSession = async (SessionId: string) => {
    try {
      const response = await deleteCoachSession({ SessionId }).unwrap();
      console.log(response, 'Session deleted successfully');
    } catch (err) {
      console.error('Failed to delete session:', err);
    }
  };
  ///////////////////// Post Enrollments//////////////////////////
  const [createCoachEnrollments] = useCreateCoachEnrollmentsMutation();

  const handlePostEnrollmentsSubmit = () => {
    createCoachEnrollments({
      TeamSeasonId: 'a0qcX000000GEggQAG',
      StudentId: '003UQ000005kyUXYAY',
      // StartDate and EndDate can be omitted
    });
  };

  ///////////////////// Delete Enrollments //////////////////////////

  const [
    deleteCoachEnrollments,
    {
      isLoading: isLoadingDeletingEnrollments,
      error: isErrorDeleteEnrollments,
    },
  ] = useDeleteCoachEnrollmentsMutation();

  const handleDeleteEnrollments = async (EnrollmentId: string) => {
    try {
      const response = await deleteCoachEnrollments({ EnrollmentId }).unwrap();
      console.log(response, 'Enrollments deleted successfully');
    } catch (err) {
      console.error('Failed to delete Enrollments:', err);
    }
  };
  ///////////////////// Patch EnrollmentId//////////////////////////
  const [
    updateCoachEnrollments,
    { isLoading: isLoadingUpdateEnrollments, error: isErrorUpdateEnrollments },
  ] = useUpdateCoachEnrollmentsIdMutation();

  const handleUpdateEnrollments = async () => {
    try {
      const EnrollmentPatchData = {
        EnrollmentId: 'a0m1T000008KwXkQAK',
        EnrollmentName: 'A-0000333',
        LastName: 'sdsd',
      };

      const response = await updateCoachEnrollments(
        EnrollmentPatchData
      ).unwrap();
      console.log('Updated enrollment response: ', response);
    } catch (err) {
      console.error('Failed to update enrollment:', err);
    }
  };
  ///////////////////// Post Attendance//////////////////////////
  const [createCoachAttendance] = useCreateCoachAttendanceMutation();
  const handlePostAttendance = async () => {
    try {
      const attendanceData = [
        {
          StudentId: '003UQ00000J6mNBYAZ', // Replace with the actual StudentId
          Attended: true, // Attendance status
        },
        // Add more students if needed
      ];

      const response = await createCoachAttendance({
        TeamSeasonId: 'a0qcX000000GEggQAG', // Your specific TeamSeasonId
        SessionId: 'a0pcX0000004gn3QAA', // Your specific SessionId
        attendanceData, // Directly pass the array of attendance data
      }).unwrap();

      console.log('Attendance submitted successfully:', response);
    } catch (err) {
      console.error('Failed to submit attendance:', err);
    }
  };
  ///////////////////// Patch Attendance//////////////////////////

  // Call this function when you want to post the attendance
  const [patchCoachAttendance] = usePatchCoachAttendanceMutation(); // Adjust the hook name based on your slice

  const handleUpdateAttendance = async () => {
    const attendancePatchData = [
      {
        AttendanceId: 'a0lcX0000008SyPQAU', // The AttendanceId you want to update
        Attended: false, // The new attendance status
      },
      // Add more students if needed
    ];
    try {
      const response = await patchCoachAttendance({
        TeamSeasonId: 'a0qcX000000GEggQAG', // Your specific TeamSeasonId
        SessionId: 'a0pcX0000004gn3QAA', // Your specific SessionId
        attendancePatchData,
      }).unwrap();

      console.log('Attendance updated successfully:', response);
    } catch (err) {
      console.error('Failed to update attendance:', err);
    }
  };

  ///////////////////// Get Attendance //////////////////////////
  const {
    data: attendances,
    isLoading: isLoadingAttendance,
    isError: isErrorAttendance,
  } = useGetCoachAttendanceQuery({
    teamSeasonId: 'a0qcX000000GEggQAG', // Your specific teamSeasonId
    sessionId: 'a0pcX0000004gn3QAA', // Your specific sessionId
  });

  ///////////////////// Get Region,TeamSeason,Session,Enrollments//////////////////////////

  const allTeamSeasons = teams
    ? GetTeamSeasonsAdapter.getSelectors().selectAll(teams)
    : [];

  const allCoachRegions = regions
    ? GetRegionAdapter.getSelectors().selectAll(regions)
    : [];
  const allCoachSessions = Allsessions
    ? GetSessionsAdapter.getSelectors().selectAll(Allsessions)
    : [];
  const allCoachSessionsId = sessionsId
    ? GetSessionsIdAdapter.getSelectors().selectAll(sessionsId)
    : [];
  const allCoachEnrollments = enrollments
    ? GetEnrollmentsAdapter.getSelectors().selectAll(enrollments)
    : [];
  const allCoachEnrollmentsId = enrollmentsId
    ? GetEnrollmentsIdAdapter.getSelectors().selectAll(enrollmentsId)
    : [];
  const allCoachAttendances = attendances
    ? GetAttendanceAdapter.getSelectors().selectAll(attendances)
    : [];

  useEffect(() => {
    // handleCreateSession();
    // handleUpdateSession();
    // handleDeleteSession('a0pcX0000004gqIQAQ');
    // handlePostEnrollmentsSubmit();
    // handleDeleteEnrollments('a0mcX0000004D1tQAE');
    // handleUpdateEnrollments();
    // handlePostAttendance();
    // handleUpdateAttendance();
  }, []);
  useEffect(() => {
    // console.log('allCoachRegions', allCoachRegions);
    // console.log('allTeamSeasons', allTeamSeasons);
    // console.log('allCoachSessions', allCoachSessions);
    // console.log('allCoachAttendances', allCoachAttendances);
    // console.log('allCoachSessionsId', allCoachSessionsId);
    // console.log('allCoachEnrollments', allCoachEnrollments);
    // console.log('allCoachEnrollmentsId', allCoachEnrollmentsId);
  }, [
    allTeamSeasons,
    allCoachRegions,
    allCoachSessions,
    allCoachSessionsId,
    allCoachEnrollments,
    allCoachEnrollmentsId,
    allCoachAttendances,
  ]);
  // if (
  //   isLoadingRegions ||
  //   isLoadingTeams ||
  //   isLoadingSessions ||
  //   isLoadingSessionsId
  // )
  //   return <Text>Loading...</Text>;
  // if (
  //   isErrorRegions ||
  //   isErrorTeams ||
  //   isErrorSession ||
  //   isErrorSessionId ||
  //   isErrorEnrollments
  // )
  //   return <Text>Error loading : {isErrorEnrollments}</Text>;

  return (
    <ScrollView className="flex-1 bg-[#EEF0F8]">
      {/* Hi, Joe Section */}
      <View className="ml-6">
        <Text
          className="my-3 font-bold text-[#000]"
          style={{
            fontSize: typography.sizes.textLarge,
            paddingVertical: typography.paddingSizes.sm,
          }}
        >
          Hi {user?.FirstName},
        </Text>
      </View>

      {/* Sessions Section */}
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

      {/* Home Task Section */}
      <View className="mx-6 flex-1 rounded-sm bg-[#EEF0F8]">
        <FlatList
          data={sessionData}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <HomeTask item={item} />}
          contentContainerStyle={{
            paddingVertical: 8,
          }}
        />
      </View>

      {/* Due Soon Task Title */}
      <View className="my-3 ml-6">
        <Text style={typography.style.subHeading} className="text-gray-700">
          Due Soon Task
        </Text>
      </View>

      {/* Due Soon Task List */}
      <View className="mx-6 flex-1 rounded-sm bg-[#EEF0F8]">
        <FlatList
          data={soonTaskData}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <SoonTask item={item} />}
        />
      </View>
    </ScrollView>
  );
}
