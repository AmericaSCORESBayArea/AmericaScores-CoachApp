export interface GetAllSessions {
  [x: string]: any;
  TeamSeasonId: string;
  SessionId: string;
  SessionName: string;
  SessionDate: string;
  SessionStartTime: string;
  SessionEndTime: string;
  Weekday: string;
  IsDeleted: string;
  SessionTopic: string;
  StudentsAbsent: string;
  StudentsPresent: string;
  AttendancePercentage: string | null;
  TeamSeasonName: string;
  TeamName: string;
  SeasonName: string;
  Region: string;
  ProgramType: string;
  UsesHeadcount: string;
}
export interface GetCoachTeamSeasonSession {
  TeamSeasonId: string;
  SessionId: string;
  SessionName: string;
  SessionDate: string;
  SessionStartTime: string;
  SessionEndTime: string;
  SessionTopic: string;
}

export interface PostSessions {
  SessionId: string;
}
export interface GetSessionsId {
  SessionId: string;
  SessionName: string;
  SessionDate: string;
  SessionStartTime: string;
  SessionEndTime: string;
  SessionTopic: string;
  TeamSeasonId: string;
  BoysPresent: string;
  GirlsPresent: string;
  NonbinaryPresent: string;
  UnknownPresent: number | null;
  UsesHeadcount: boolean;
  ProgramType: string;
}

export interface PatchSessionsId {
  SessionId: string;
  SessionName?: string;
  SessionDate?: string;
  SessionTopic?: string;
  TeamSeasonId?: string;
  Headcount?: number;
  FemaleHeadcount?: number;
}
export interface DeleteSessionsId {
  SessionId: string;
}
