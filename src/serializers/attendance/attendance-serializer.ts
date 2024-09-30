import type { PostAttendance } from '@/interfaces/entities/attendance/attendance-entities';

export function PostAttendanceSerializer(
  attendance: PostAttendance
): PostAttendance {
  const { SessionId, StudentId, Attended } = attendance;

  return {
    SessionId,
    StudentId,
    Attended,
  };
}
