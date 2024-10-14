import type { GetAttendance } from '@/interfaces/entities/attendance/attendance-entities';
import { createEntityAdapter } from '@reduxjs/toolkit';

export const GetAttendanceAdapter = createEntityAdapter<GetAttendance, string>({
  selectId: (attendance) => attendance.StudentId,
});
