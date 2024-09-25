/* eslint-disable max-params */

export interface SessionIdGetType {
  sessionId: string;
}

export const inscribeSessionIdGetParams = (
  sessionId: string
): SessionIdGetType => ({
  sessionId,
});

export const sessionsIdForGetParams: SessionIdGetType =
  inscribeSessionIdGetParams('a0p1T00000FcFfGQAV');

export interface SessionIdPatchType {
  sessionId: string;
}

export const inscribeSessionIdPatchParams = (
  sessionId: string
): SessionIdPatchType => ({
  sessionId,
});

export const sessionsIdForPatchParams: SessionIdPatchType =
  inscribeSessionIdPatchParams('a0p1T00000FcFfGQAV');

export interface SessionPatchType {
  SessionName: string;
  SessionDate: string;
  SessionTopic: string;
  TeamSeasonId: string;
  Headcount: number;
  FemaleHeadcount: number;
}

export const inscribeSessionPatchBody = (
  SessionName: string,
  SessionDate: string,
  SessionTopic: string,
  TeamSeasonId: string,
  Headcount: number,
  FemaleHeadcount: number
): SessionPatchType => ({
  SessionName,
  SessionDate,
  SessionTopic,
  TeamSeasonId,
  Headcount,
  FemaleHeadcount,
});

export const sessionIdForPatchBody: SessionPatchType = inscribeSessionPatchBody(
  'Updated Session Name',
  '2024-09-30',
  'Soccer',
  'a0q1T000008Jt3NQAS',
  0,
  0
);

export const sessionIdForPatch = 'a0pcX0000004eQHQAY';

export interface SessionIdDeleteType {
  sessionId: string;
}

export const inscribeSessionIdDeleteParams = (
  sessionId: string
): SessionIdDeleteType => ({
  sessionId,
});

export const sessionsIdForDeleteParams: SessionIdDeleteType =
  inscribeSessionIdDeleteParams(sessionIdForPatch);
