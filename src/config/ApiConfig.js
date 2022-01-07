import DeviceInfo from 'react-native-device-info';
export const ApiConfig = {
    baseUrl: 'https://salesforce-auth-api-prod.us-e2.cloudhub.io/api',
    dataApi: 'https://salesforce-data-api-proxy-prod.us-e2.cloudhub.io/api',
    clientId: '87de15a992ad4510bf4f4a43d2f0e4bc', //Keep it blank and only add them when compiling / testing, but DO NOT commit the keys as part of the code
    clientSecret: '415d5220915f4c81814978896a4AEcC3',
    slackWebHook: 'https://hooks.slack.com/services/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%27', //token for slack integration
    cloudName: 'americascores-bayarea',//cloud name on cloudinary
    cloudinaryURL: 'https://api.cloudinary.com/v1_1/americascores-bayarea/upload%27',//url for cloudinary
    appVersion: 'Version: ' + DeviceInfo.getVersion(),
    youtubeApi: 'https://www.googleapis.com/youtube/v3/playlistItems?part=snippet%2C+id&playlistId=PLKLW4r_wa4rzyKrXbXGkv7J5dLY6q-guC',//youtube api url with the playlistID
    youtubeSecretKey: 'AIzaSyAcpN2gYGNdGJPjAy8AWTcmaBK3BXx3DvA'//token for youtube integration
}