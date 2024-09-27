import type { AttendancePost } from '@/interfaces/entities/attendance/attendance-entities';

export function AttendancePostSerializer(
  attendance: AttendancePost
): AttendancePost {
  const { SessionId, StudentId, Attended } = attendance;

  return {
    SessionId,
    StudentId,
    Attended,
  };
}
