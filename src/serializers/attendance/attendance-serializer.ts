import type {
  GetAttendance,
  PatchAttendance,
  PostAttendance,
} from '@/interfaces/entities/attendance/attendance-entities';

export function GetAttendanceSerializer(
  attendance: GetAttendance
): GetAttendance {
  const { AttendanceId, StudentName, StudentId, Attended } = attendance;

  return {
    AttendanceId,
    StudentName,
    Attended,
    StudentId,
  };
}
export function PostAttendanceSerializer(
  attendance: PostAttendance
): PostAttendance {
  const { Message, Attendance_Taken } = attendance;

  return {
    Message,
    Attendance_Taken,
  };
}
export function PatchAttendanceSerializer(
  attendance: PatchAttendance
): PatchAttendance {
  const { message } = attendance;

  return {
    message,
  };
}
