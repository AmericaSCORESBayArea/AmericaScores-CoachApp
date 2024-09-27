export interface Sessions {
  TeamSeasonId: string;
  SessionId: string;
  SessionName: string;
  SessionDate: string;
  SessionStartTime: string;
  SessionEndTime: string;
  SessionTopic: string;
}
export interface SessionsId {
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
export interface SessionsPost {
  SessionId: string;
}
