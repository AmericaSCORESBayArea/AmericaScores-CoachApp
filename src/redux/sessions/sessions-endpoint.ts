import { EndpointPaths } from '@/interfaces/end-points-paths';
import type { EntityState } from '@reduxjs/toolkit';
import { ApiTagTypes } from '../api-tag-types';
import type { Sessions } from '@/interfaces/entities/session/sessions-entities';

import { apiSlice, providesList } from '../apiSlice';
import { sessionsAdapter } from '@/api/adaptars/sessions/session-adapter';
import { sessionsSerializer } from '@/serializers/sessions/session-serializer';
import { getSessionsParams } from '@/interfaces/params/sessions/session-material';

// Retrieve session parameters
const sessionsGetParams = getSessionsParams();

console.log('idd : ', sessionsGetParams);

export const brandEndpoints = apiSlice
  .enhanceEndpoints({
    addTagTypes: [ApiTagTypes.COACH_SESSIONS],
  })
  .injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({
      getCoachSessions: builder.query<EntityState<Sessions, string>, void>({
        query: () => ({
          url: `${EndpointPaths.COACH_SESSIONS}?teamSeasonId=${sessionsGetParams.teamSeasonId}&date=${sessionsGetParams.date}`,
          // url: `${EndpointPaths.COACH_SESSIONS}?teamSeasonId=${teamSeasonId}&date=${date}`,
          method: 'GET',
        }),

        transformResponse: (response: Sessions[]) => {
          console.log('sadfgh', response);
          return sessionsAdapter.setAll(
            sessionsAdapter.getInitialState(),
            response.map(sessionsSerializer)
          ) as EntityState<Sessions, string>;
        },

        providesTags: (result) =>
          providesList(result?.ids, ApiTagTypes.COACH_SESSIONS),
      }),
    }),
  });

export const { useGetCoachSessionsQuery } = brandEndpoints;
