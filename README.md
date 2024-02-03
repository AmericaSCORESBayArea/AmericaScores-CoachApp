# AmericaScores Coach Application for Tracking Participation and Experiences

React native based mobile app for Americas scores attendance control.

## Pre-install required tools

The project requires the following apps running over the project. You can follow the steps in the [Official React-Native guide](https://reactnative.dev/docs/environment-setup). Or install them by yourself.
Please stick to the verified versions of the dependencies unless you are prepared to perform a full smoke test and have a qualified engineer ready to review and test your Pull Request.

- [Node](https://nodejs.org/en/) (see below for verified version)
- [For IOS][cocoa pods](https://cocoapods.org/)
- **Physical device** connected to your computer with USB debugging enabled or an **Emulator** `(**IOS** download XCode from your appstore | **Android** Download android studio)`
- Text editor of your choice `[XCode | Android studio | Visual studio Code ]` (Make sure that whatever editor you use is running as administrator)

### Verified configuration for building

Tested on: MacOS on M1

```
node --version
v20.9.0
pod --version
1.13.0
java --version
java 17.0.2 2022-01-18 LTS
Java(TM) SE Runtime Environment (build 17.0.2+8-LTS-86)
Java HotSpot(TM) 64-Bit Server VM (build 17.0.2+8-LTS-86, mixed mode, sharing)
```

### A Step-by-Step Guide to build and run the app on Android (verified on MacOS with M1)

**YOU SHOULD HAVE JDK 17 INSTALLED IN ORDER TO BUILD THE APP ON ANDROID**

1. Fix src/config/ApiConfig.js
2. put google-services.json, debug.keystore, america-scores-keystore.jks into android/app
3. remove package-lock.json and node_modules folder
4. npm install
5. Make sure PATH contains ANDROID_HOME with `echo $ANDROID_HOME` if result is empty fix PATH with:

```
nano ~/.zprofile

add 3 lines somewhere at the end of the file:

export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools

close terminal and open it again
verify everything is ok with echo $ANDROID_HOME. Make sure it outputs something like "/Users/Pete/Library/Android/sdk"

```

6. connect device or start emulator
7. ./build_and_run_android_release.sh

To build apk for Google Play release:

1. cd android
2. ./gradlew assembleRelease
3. cd app/build/outputs/bundle/release
4. open .
5. upload apk to Google Play

## Guide to build and run the app on Android (verified on Windows 10 and 11)

**YOU SHOULD HAVE JDK 17 INSTALLED IN ORDER TO BUILD THE APP ON ANDROID**

1. Fix src/config/ApiConfig.js
2. put google-services.json, debug.keystore, america-scores-keystore.jks into android/app
3. remove package-lock.json and node_modules folder
4. create local.properties inside /android and put sdk.dir=C:\\Users\\{YOUR_USER}\\AppData\\Local\\Android\\sdk
5. npm install
6. Make sure User Variables contains:

- C:\Users\{YOUR_USER}\AppData\Local\Android\Sdk
- C:\Users\{YOUR_USER}\AppData\Local\Android\Sdk\platform-tools

7. Make sure System Variables contains:

- C:\Users\{YOUR_USER}\AppData\Local\Android\Sdk\platform-tools\adb.exe

8. In Android Studio, open Settings->Languages & Frameworks->Android SDK, select 'Android 14.0 ("UpsideDownCake") API Level 34' as the SDK version.
9. In Device Manager, create a virtual device with API level 34+.
10. To build on a connected physical device, ensure that USB debugging is turned on via developer mode
11. connect device or start emulator by adding it in 'Running Devices'
12. npm run android

### A Step-by-Step Guide to build and run the app on iOS (verified on MacOS with M1)

1. Fix src/config/ApiConfig.js
2. put GoogleService-Info.plist into ios folder
3. remove package-lock.json and node_modules folder
4. npm install (If npm install does not run, try sudo 'npm install -g npm@latest' before running 'npm install')
5. cd ios
6. pod install
7. If pods do not build completely, try pod update
8. cd ..
9. open ios/AmericanScoresApp.xcworkspace
10. from the project directory build and run with react-native run-ios --simulator="iPhone 14 Pro" (or whatever you have installed)

### When the app launches, the sign-in screen should look something like this:<br>

![image](https://github.com/AmericaSCORESBayArea/AmericaScores-CoachApp/assets/1458369/51bd374c-b671-4fca-b2ea-4d2a50ed6586)

### A Step-by-Step Guide to build and run the app on iOS (verified on MacOS w/ Intel Chip)

1. Fix src/config/ApiConfig.js
2. put GoogleService-Info.plist into ios folder
3. put debug.keystore into android/app
4. remove package-lock.json and node_modules folder
5. npm install (If npm install does not work, try to run 'sudo npm install -g npm@latest' before running 'npm install')
6. cd ios
7. pod install
8. If pods do not build completely, try pod update
9. cd ..
10. npm run android
11. If build is successful but an error occurs with Metro, try 'npx react-native start'

### If you upgrade Node, React, or Pods, please test and help us maintain dependencies!

- Make a branch
- Invite some recent contributors to test your update with you
- make sure to note the new versions in the section above: [Verified configuration for building](https://github.com/AmericaSCORESBayArea/AmericaScores-CoachApp/tree/master#verified-configuration-for-building)

# Release History

## In Store

### Apple App Store: v 20.1

### Google Play Store: v 60.0

| **Release** | **Date** | **Platform** | **Commit**                                                                                                                                 | **Notes**                                                                                     |
| ----------- | -------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------- |
| 20.2 (61)   | 11-21-23 | Android+iOS  | [Master:beec5a0](https://github.com/AmericaSCORESBayArea/AmericaScores-CoachApp/commit/beec5a0b1afe658d4599bb83c2cad97a884dd7e6)           | Fix/upate a few things affected by v20 dependency updates                                     |
| 60.0        | 11-8-23  | Android      | [Branch:react-native-0.72](https://github.com/AmericaSCORESBayArea/AmericaScores-CoachApp/commit/5d50a6c3b358dea718e45baa9a8a3fb3c1a2e3cc) | Android Crash Fix                                                                             |
| 20.1        | 11-3-23  | iOS          | [Branch:react-native-0.72](https://github.com/AmericaSCORESBayArea/AmericaScores-CoachApp/commit/ba89891699a8765a7df8d354c6a9109e60b7f53b) | Replaced Slack Connect (private)                                                              |
| 20          | 10-31-23 | iOS          | [Branch:react-native-0.72](https://github.com/AmericaSCORESBayArea/AmericaScores-CoachApp/commit/ba89891699a8765a7df8d354c6a9109e60b7f53b) | Update React+Pods to fix multiple Firebase Auth issues and get dependencies to newer LTS      |
| 3.95        | 8-22-23  | iOS          |                                                                                                                                            | Reapply Creds                                                                                 |
| 3.9         | 6-4-23   | iOS          |                                                                                                                                            | new Firebase Project ID                                                                       |
| 3.8         | 6-3-23   | iOS          | [7a1e5b3](https://github.com/AmericaSCORESBayArea/AmericaScores-CoachApp/commit/7a1e5b31b8f5f65580508f8f686ab3a227ae7a8a)                  | https://github.com/AmericaSCORESBayArea/AmericaScores-CoachApp/pull/378 iOS Firebase Auth bug |
|             |          |              |                                                                                                                                            |                                                                                               |
|             |          |              |                                                                                                                                            |                                                                                               |
