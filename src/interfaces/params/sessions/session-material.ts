// sessionParamsStore.ts
export interface SessionsGetType {
  teamSeasonId: string;
  date: string;
}

let sessionsGetParams: SessionsGetType = {
  teamSeasonId: '',
  date: '',
};

// Function to set session parameters
export const inscribeSessionsParams = (teamSeasonId: string, date: string) => {
  sessionsGetParams = { teamSeasonId, date };
};

// Function to get session parameters
export const getSessionsParams = (): SessionsGetType => {
  return sessionsGetParams;
};

///////////////////////////////////////////////////

interface SessionPostType {
  SessionDate: string;
  SessionTopic: string;
  TeamSeasonId: string;
}
export const inscribeSessionPostData = (
  SessionDate?: string,
  SessionTopic?: string,
  TeamSeasonId?: string
): SessionPostType => {
  return {
    SessionDate: SessionDate || '',
    SessionTopic: SessionTopic || '',
    TeamSeasonId: TeamSeasonId || '',
  };
};

export const sessionPostBody: SessionPostType = {
  SessionDate: inscribeSessionPostData().SessionDate,
  SessionTopic: inscribeSessionPostData().SessionTopic,
  TeamSeasonId: inscribeSessionPostData().TeamSeasonId,
};
