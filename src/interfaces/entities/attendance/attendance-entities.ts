export interface GetAttendance {
  AttendanceId: string;
  StudentName: string;
  Attended: boolean;
  StudentId: string;
}

export interface PostAttendance {
  Message: string;
  Attendance_Taken: boolean;
}

export interface PatchAttendance {
  message: string;
}
