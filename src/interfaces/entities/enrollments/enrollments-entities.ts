// Base interface: GetEnrollments
export interface GetEnrollments {
  EnrollmentId: string;
  EnrollmentName: string;
  Attended: boolean;
  RecordType: string;
  SessionId: string;
  SessionName: string;
  StudentId: string;
  FirstName: string;
  LastName: string;
  Birthdate: string;
  Gender: string;
  Ethnicity: string;
  StudentIncompleteRecord: boolean;
  ZipCode: string;
  Date: string;
}

export interface PostEnrollments {
  EnrollmentId: string;
}

export interface DeleteEnrollments {
  EnrollmentId: string;
}

export interface GetEnrollmentsId {
  EnrollmentId: string;
  EnrollmentName: string;
  TeamSeasonId: string;
  StudentId: string;
  StudentName: string;
  FirstName: string;
  LastName: string;
  Birthdate: string;
  Gender: string;
  Ethnicity: string;
  ZipCode: string;
}
export interface PatchEnrollmentsId {
  EnrollmentId: string;
  EnrollmentName?: string;
  TeamSeasonId?: string;
  StudentId?: string;
  StudentName?: string;
  FirstName?: string;
  LastName?: string;
  Birthdate?: string;
  Gender?: string;
  Ethnicity?: string;
  ZipCode?: string;
}
