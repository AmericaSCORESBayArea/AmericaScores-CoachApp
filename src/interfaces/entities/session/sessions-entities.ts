export interface GetSessions {
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
