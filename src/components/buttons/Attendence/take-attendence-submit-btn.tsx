import { Pressable, Text, View, ActivityIndicator } from 'react-native';
import React from 'react';
import { usePatchCoachAttendanceMutation } from '@/redux/attendance/attendance-endpoints';
import { useRouter } from 'expo-router';

interface AttendenceSubmitType {
  attendenceCount: number;
  studentAttendanceMark: { AttendanceId: string; Attended: boolean }[];
}

interface AttendenceSubmitProps {
  item: AttendenceSubmitType;
}

const TakeAttendenceSubmitBtn: React.FC<AttendenceSubmitProps> = ({ item }) => {
  const [
    patchCoachAttendance,
    { isLoading: isLoadingUpdateSession, error: isErrorUpdateSession },
  ] = usePatchCoachAttendanceMutation(); // Adjust the hook name based on your slice
  const router = useRouter();

  const handleUpdateAttendance = async () => {
    // Create the attendance patch data based on studentAttendanceMark
    const attendancePatchData = item.studentAttendanceMark.map((student) => ({
      AttendanceId: student.AttendanceId, // Make sure each student has this field
      Attended: student.Attended, // Current attendance status
    }));

    try {
      const response = await patchCoachAttendance({
        TeamSeasonId: 'a0qcX000000GEggQAG', // Your specific TeamSeasonId
        SessionId: 'a0pcX0000004gn3QAA', // Your specific SessionId
        attendancePatchData, // Pass the constructed attendance patch data
      }).unwrap();

      console.log('Attendance updated successfully:', response);
      router.push('/');
    } catch (err) {
      console.error('Failed to update attendance:', err);
    }
  };

  return (
    <View>
      <Pressable
        onPress={handleUpdateAttendance}
        className={`mx-6 mb-2 w-[90%] items-center justify-center rounded-md py-3 ${
          item.attendenceCount > 0 ? 'bg-primary-700' : ''
        }`}
        disabled={isLoadingUpdateSession} // Disable button when loading
      >
        {isLoadingUpdateSession ? (
          <ActivityIndicator
            size="small"
            color={item.attendenceCount > 0 ? '#ffffff' : '#000000'}
          /> // Loading indicator
        ) : (
          <Text
            className={item.attendenceCount > 0 ? 'text-white' : 'text-black'}
          >
            Submit
          </Text>
        )}
      </Pressable>
    </View>
  );
};

export default TakeAttendenceSubmitBtn;
