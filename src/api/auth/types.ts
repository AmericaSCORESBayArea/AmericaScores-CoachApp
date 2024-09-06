//loginTypes.ts
export type LoginResponse = {
  access_token: string;
  refresh_token: string;
  token_type: string;
  scope: string;
  id: string;
  username: string;
};
