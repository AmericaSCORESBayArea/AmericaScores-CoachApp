import DeviceInfo from 'react-native-device-info';

export const ApiConfig = {
    baseUrl: 'https://salesforce-auth-api-prod.us-e2.cloudhub.io/api',
    dataApi: 'https://salesforce-data-api-proxy-prod.us-e2.cloudhub.io/api',
    clientId: '', //Keep it blank and only add them when compiling / testing, but DO NOT commit the keys as part of the code
    clientSecret: '',
    slackWebHook: '',//token for slack integration
    cloudName: '',//cloud name on cloudinary
    cloudinaryURL: '',//url for cloudinary
    appVersion: 'Version: ' + DeviceInfo.getVersion()//add the app version
}