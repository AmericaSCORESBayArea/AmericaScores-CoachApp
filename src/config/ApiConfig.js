import DeviceInfo from "react-native-device-info";
export const ApiConfig = {
  baseUrl: "https://salesforce-auth-api-prod.us-e2.cloudhub.io/api",
  dataApi: "https://salesforce-data-api-proxy-prod.us-e2.cloudhub.io/api",
  clientId: "87de15a992ad4510bf4f4a43d2f0e4bc", //Keep it blank and only add them when compiling / testing, but DO NOT commit the keys as part of the code
  clientSecret: "415d5220915f4c81814978896a4AEcC3",
  clientIdSandbox: "a647e195e65c4a358563bd950916e28d",
  clientSecretSandbox: "45CDe2241f4C4D238d320fc6A7521C71",
  slackWebHook:
    "https://hooks.slack.com/services/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", //token for slack integration
  cloudName: "americascores-bayarea", //cloud name on cloudinary
  cloudinaryURL: "https://api.cloudinary.com/v1_1/americascores-bayarea/upload", //url for cloudinary
  appVersion: "Version: " + DeviceInfo.getVersion(), //add the app version
  youtubeApi:
    "https://www.googleapis.com/youtube/v3/playlistItems?part=snippet%2C+id&playlistId=PLKLW4r_wa4rzyKrXbXGkv7J5dLY6q-guC", //youtube api url with the playlistID
  youtubeSecretKey: "AIzaSyAcpN2gYGNdGJPjAy8AWTcmaBK3BXx3DvA", //token for youtube integration
  scoresuURL: "https://scoresu.org/intro-to-america-scores", //url for scoresU
  apiKey: "AIzaSyD_QiB-4dXZMZyu60aEjBfA_8ucrQwoahg", //firebase api key
  authDomain: "america-scores.firebaseapp.com", //firebase auth domain
  databaseURL: "https://america-scores.firebaseio.com", //firebase base url
  projectId: "america-scores", //firebase project id
  storageBucket: "america-scores.appspot.com", //firebase bucket
  messagingSenderId: "688897090799", //firebase messaging sender id
  appId: "1:688897090799:web:309bc9231449447df6e71a", //firebase app id
};
