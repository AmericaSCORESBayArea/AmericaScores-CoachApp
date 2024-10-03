import type { PostAttendance } from '@/interfaces/entities/attendance/attendance-entities';
import { createEntityAdapter } from '@reduxjs/toolkit';

export const PostAttendanceAdapter = createEntityAdapter<
  PostAttendance,
  string
>({
  selectId: (attendance) => attendance.SessionId,
});
