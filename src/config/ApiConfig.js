import DeviceInfo from 'react-native-device-info';
export const ApiConfig = {
    baseUrl: 'https://salesforce-auth-api-prod.us-e2.cloudhub.io/api',
    dataApi: 'https://salesforce-data-api-proxy-prod.us-e2.cloudhub.io/api',
    clientId: '', //Keep it blank and only add them when compiling / testing, but DO NOT commit the keys as part of the code
    clientSecret: '',
    slackWebHook: '',//token for slack integration
    cloudName: '',//cloud name on cloudinary
    cloudinaryURL: '',//url for cloudinary
    appVersion: 'Version: ' + DeviceInfo.getVersion(),//add the app version
    youtubeApi: 'https://www.googleapis.com/youtube/v3/playlistItems?part=snippet%2C+id&playlistId=PLKLW4r_wa4rzyKrXbXGkv7J5dLY6q-guC',//youtube api url with the playlistID
    youtubeSecretKey: '',//token for youtube integration
    scoresuURL: 'https://scoresu.org/intro-to-america-scores'//url for scoresu
}
