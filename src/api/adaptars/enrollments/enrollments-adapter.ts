import type {
  GetEnrollments,
  GetEnrollmentsId,
} from '@/interfaces/entities/enrollments/enrollments-entities';
import { createEntityAdapter } from '@reduxjs/toolkit';

export const GetEnrollmentsAdapter = createEntityAdapter<
  GetEnrollments,
  string
>({
  selectId: (enrollments) => enrollments.EnrollmentId,
});
export const GetEnrollmentsIdAdapter = createEntityAdapter<
  GetEnrollmentsId,
  string
>({
  selectId: (enrollments) => enrollments.EnrollmentId,
});
