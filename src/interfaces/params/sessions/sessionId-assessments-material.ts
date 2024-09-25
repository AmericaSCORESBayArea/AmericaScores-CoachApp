export interface SessionIdAssessmentsGetType {
  sessionId: string;
}

export const inscribeSessionIdAssessmentsGetParams = (
  sessionId: string
): SessionIdAssessmentsGetType => ({
  sessionId,
});

export const sessionIdAssessmentsForGetParams: SessionIdAssessmentsGetType =
  inscribeSessionIdAssessmentsGetParams('a0p1T00000FcFfGQAV');

export interface SessionIdAssessmentsPostType {
  StudentId: string;
  AssessmentResponse: string;
  AssessmentType: string;
}

export const inscribeSessionIdAssessmentsPostBody = (
  StudentId: string,
  AssessmentResponse: string,
  AssessmentType: string
): SessionIdAssessmentsPostType => ({
  StudentId,
  AssessmentResponse,
  AssessmentType,
});

export const sessionIdAssessmentsForPostBody: SessionIdAssessmentsPostType =
  inscribeSessionIdAssessmentsPostBody('0031T00004EjgC8QAJ', '5', 'PACER');
