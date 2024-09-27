import type { AttendancePost } from '@/interfaces/entities/attendance/attendance-entities';
import { createEntityAdapter } from '@reduxjs/toolkit';

export const attendanceAdapter = createEntityAdapter<AttendancePost, string>({
  selectId: (attendance) => attendance.SessionId,
});
