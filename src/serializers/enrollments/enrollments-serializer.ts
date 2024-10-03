import type {
  DeleteEnrollments,
  GetEnrollments,
  GetEnrollmentsId,
  PatchEnrollmentsId,
  PostEnrollments,
} from '@/interfaces/entities/enrollments/enrollments-entities';

export function GetEnrollmentsSerializer(
  enrollments: GetEnrollments
): GetEnrollments {
  const {
    EnrollmentId,
    EnrollmentName,
    Attended,
    RecordType,
    SessionId,
    SessionName,
    StudentId,
    FirstName,
    LastName,
    Birthdate,
    Gender,
    Ethnicity,
    StudentIncompleteRecord,
    ZipCode,
    Date,
  } = enrollments;

  return {
    EnrollmentId,
    EnrollmentName,
    Attended,
    RecordType,
    SessionId,
    SessionName,
    StudentId,
    FirstName,
    LastName,
    Birthdate,
    Gender,
    Ethnicity,
    StudentIncompleteRecord,
    ZipCode,
    Date,
  };
}

export function PostEnrollmentsSerializer(
  enrollments: PostEnrollments
): PostEnrollments {
  const { EnrollmentId } = enrollments;

  return {
    EnrollmentId,
  };
}
export function DeleteEnrollmentsSerializer(
  enrollments: DeleteEnrollments
): DeleteEnrollments {
  const { EnrollmentId } = enrollments;

  return {
    EnrollmentId,
  };
}

export function GetEnrollmentsIdSerializer(
  enrollments: GetEnrollmentsId
): GetEnrollmentsId {
  const {
    EnrollmentId,
    EnrollmentName,
    TeamSeasonId,
    StudentId,
    StudentName,
    FirstName,
    LastName,
    Birthdate,
    Gender,
    Ethnicity,
    ZipCode,
  } = enrollments;

  return {
    EnrollmentId,
    EnrollmentName,
    TeamSeasonId,
    StudentId,
    StudentName,
    FirstName,
    LastName,
    Birthdate,
    Gender,
    Ethnicity,
    ZipCode,
  };
}

export function PatchEnrollmentsIdSerializer(
  enrollments: PatchEnrollmentsId
): PatchEnrollmentsId {
  const {
    EnrollmentId,
    EnrollmentName,
    TeamSeasonId,
    StudentId,
    StudentName,
    FirstName,
    LastName,
    Birthdate,
    Gender,
    Ethnicity,
    ZipCode,
  } = enrollments;

  return {
    EnrollmentId,
    EnrollmentName,
    TeamSeasonId,
    StudentId,
    StudentName,
    FirstName,
    LastName,
    Birthdate,
    Gender,
    Ethnicity,
    ZipCode,
  };
}
