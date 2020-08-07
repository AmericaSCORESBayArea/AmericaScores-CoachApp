# AmericaScores-attendanceApp
React native based mobile app for Americas scores attendance controll.

## Set up

The following steps are needed in order to run the project.

### Pre-installed tools 

The project requires the following apps running over the project. You can follow the steps in the [Official React-Native guide](https://reactnative.dev/docs/environment-setup). Or install them by yourself.
  - [Node](https://nodejs.org/en/) or if using mac `brew install node && brew install watchman`
  - React-native-cli by running `npm install -g expo-cli`
  - [For IOS] [Cocoa pods](https://cocoapods.org/)  || If any errors while installing cocoa pods please follow this link (https://stackoverflow.com/questions/20939568/error-error-installing-cocoapods-error-failed-to-build-gem-native-extension)
  - **Physical device** connected to your computer with USB debugging enabled or an **Emulator** `(**IOS** download XCode from your appstore | **Android** Download android studio)`
  - Text editor of your choice `[XCode | Android studio | Visual studio Code ]`

Check If everything was installed propertly.
  - Check if **node** is installed: `node --version` it should return something like `Vxx.x.x`
  - Check if **npm** is installed: `npm --version` it should return something like `x.xx.x`

### Install the project.

Clone the project from github into your local machine.
`cd AmericaScores-attendanceApp
`npm install` -> Installs the dependencies for the project
  - If running in IOS `cd ios && pod install && cd ..` and then `react-native run-ios`
  - If running on Android
    `react-native run-android`

### Dependencies
* [UI Kitten](https://akveo.github.io/react-native-ui-kitten/) Built in UI components used over the app frontend development
* [React Navigation](https://reactnavigation.org/) This library is used for navigating between screens over the app.
* [QR-Scanner](https://www.npmjs.com/package/react-native-qrcode-scanner) Library used for QR Camera scan function

**Miscellaneous**
* [React permissions](https://github.com/react-native-community/react-native-permissions) permissions for using device hardware like camera or bluetooth
* [Eva Icons](https://akveo.github.io/eva-icons/) Selected Icons Pack
