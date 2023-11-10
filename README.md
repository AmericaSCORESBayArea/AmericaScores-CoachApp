# AmericaScores-attendanceApp

React native based mobile app for Americas scores attendance control.

## Pre-install required tools

The project requires the following apps running over the project. You can follow the steps in the [Official React-Native guide](https://reactnative.dev/docs/environment-setup). Or install them by yourself.

- [Node](https://nodejs.org/en/) (see below for verififed version)
- [For IOS][cocoa pods](https://cocoapods.org/)
- **Physical device** connected to your computer with USB debugging enabled or an **Emulator** `(**IOS** download XCode from your appstore | **Android** Download android studio)`
- Text editor of your choice `[XCode | Android studio | Visual studio Code ]` (Make sure that whatever editor you use is running as administrator)

### Verified configuration for MacOS on M1
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
2. ./gradlew bundleRelease
3. cd app/build/outputs/bundle/release
4. open .
5. upload apk to Google Play


### A Step-by-Step Guide to build and run the app on iOS (verified on MacOS with M1)
1. Fix src/config/ApiConfig.js
2. put GoogleService-Info.plist into ios folder
3. remove package-lock.json and node_modules folder
4. npm install
5. cd ios
6. pod install
7. cd ..
8. open ios/AmericanScoresApp.xcworkspace
