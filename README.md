# AmericaScores-attendanceApp

React native based mobile app for Americas scores attendance controll.

## Set up

The following steps are needed in order to run the project.

### Pre-installed tools

The project requires the following apps running over the project. You can follow the steps in the [Official React-Native guide](https://reactnative.dev/docs/environment-setup). Or install them by yourself.

- [Node](https://nodejs.org/en/) or if using mac `brew install node && brew install watchman`
- React-native-cli by running `npm install -g expo-cli` and `npm install -g react-native-cli`
- [For IOS][cocoa pods](https://cocoapods.org/) || If any errors while installing cocoa pods please follow this link (https://stackoverflow.com/questions/20939568/error-error-installing-cocoapods-error-failed-to-build-gem-native-extension)
- **Physical device** connected to your computer with USB debugging enabled or an **Emulator** `(**IOS** download XCode from your appstore | **Android** Download android studio)`
- Text editor of your choice `[XCode | Android studio | Visual studio Code ]` (Make sure that whatever editor you use is running as administrator)

Check if everything was installed propertly.

- Check if **node** is installed: `node --version` it should return something like `Vxx.x.x`
- Check if **npm** is installed: `npm --version` it should return something like `x.xx.x`

### Install the project.

Clone the project from github into your local machine.
`cd AmericaScores-attendanceApp`npm install` -> Installs the dependencies for the project

- If running in IOS `cd ios && pod install && cd ..` and then `react-native run-ios`
- If running on Android
  `react-native run-android`
- Once the build is finished and the app installed, just open it in your emulator/device.

### Frequent errors

Here are a list of errors that may occur when installing the project and how to handle them.

- **ERROR: JAVA_HOME is set to an invalid directory..**. Search for "enviroment variables" in your computers search bar and open "Edit the System Enviroment Variables", click "Enviroment Variables" and check that `JAVA_HOME` variable is referencing your jdk package path, and that it is also being referenced in your "Path" system variable. You can also set the variable from the terminal by typing `JAVA_HOME = C:\YourJDKPath`.

- **adb is not recognized as a command**. Check your system enviroment variables to see if adb exists, if not, create it and set the adb's path in value, it should be in `C:\Users\YourUser\AppData\Local\Android\Sdk\platform-tools`. You can check this yourself by typing `%appdata%` in the windows search bar, this will give you acces to your AppData folder.

- **Keystore file '/Project-Folder/android/app/debug.keystore' not found for signing config 'debug'**. Search for your keytools.exe file, it should be in C:\Program Files\Java\jdk.x.x.xx\bin. Copy the path of the file's folder. Open a terminal and type `cd C:\"yourkeytoolsfolderpath"`. Once you are in your keytools folder, copy and execute the following: `keytool -genkey -v -keystore debug.keystore -storepass android -alias androiddebugkey -keypass android -keyalg RSA -keysize 2048 -validity 10000`. This will create a file called **debug.keystore** in the same path as the keytools.exe file. Copy the new file and paste it in AmericaScores-attendanceApp\android\app

### Dependencies

- [UI Kitten](https://akveo.github.io/react-native-ui-kitten/) Built in UI components used over the app frontend development
- [React Navigation](https://reactnavigation.org/) This library is used for navigating between screens over the app.
- [QR-Scanner](https://www.npmjs.com/package/react-native-qrcode-scanner) Library used for QR Camera scan function

**Miscellaneous**

- [React permissions](https://github.com/react-native-community/react-native-permissions) permissions for using device hardware like camera or bluetooth

- [Eva Icons](https://akveo.github.io/eva-icons/) Selected Icons Pack

### Before Running
ApiConfig.js needs to be updated with valid clientId and clientSecret so firebase can connect to the API's.

## Additional iOS Configuration Details
The following files appear to contain important version information to getting the build to complete:
ios/AmericanScoresApp.xcodeproj/project.pbxproj
ios/Podfile
ios/Podfile.lock
This guide is useful to understanding how and when to use pod install, update, outdate.
### A Step-by-Step Troubleshooting Record
starting iOS build from scratch...
- [x] npm install warning
``Successfully installed react-native-unimodules. This package contains core unimodules that are commonly depended on by other unimodules. You will need to configure your project before using other unimodules like expo-camera, expo-media-library and others.
See configuration guide:
  https://www.npmjs.com/package/react-native-unimodules/v/0.10.1``
  
- [x] pod install has this warning
``[!] CocoaPods could not find compatible versions for pod "Firebase/DynamicLinks":
  In snapshot (Podfile.lock):
    Firebase/DynamicLinks (= 6.30.0, ~> 6.30.0)
  In Podfile:
    RNFBDynamicLinks (from `../node_modules/@react-native-firebase/dynamic-links`) was resolved to 7.5.13, which depends on
      Firebase/DynamicLinks (~> 6.34.0)
You have either:
 * out-of-date source repos which you can update with `pod repo update` or with `pod install --repo-update`.
 * changed the constraints of dependency `Firebase/DynamicLinks` inside your development pod `RNFBDynamicLinks`.
   You should run `pod update Firebase/DynamicLinks` to apply changes you've made.``
   
- [x] additional warnings
``[!] NPM package '@react-native-firebase/auth' depends on '@react-native-firebase/app' v8.3.1 but found v8.4.7, this might cause build issues or runtime crashes.
[!] NPM package '@react-native-firebase/dynamic-links' depends on '@react-native-firebase/app' v9.0.0 but found v8.4.7, this might cause build issues or runtime crashes.
[!] NPM package '@react-native-firebase/auth' depends on '@react-native-firebase/app' v8.3.1 but found v8.4.7, this might cause build issues or runtime crashes.
[!] NPM package '@react-native-firebase/dynamic-links' depends on '@react-native-firebase/app' v9.0.0 but found v8.4.7, this might cause build issues or runtime crashes.``
- [x] pod update then
- [x] pod update Firebase/DynamicLinks
this clears the red warnings leaving only the version warnings above.

- [x] npm outdated
``Package                                       Current   Wanted  Latest  Location
@invertase/react-native-apple-authentication    1.1.2    1.1.2   2.1.0  global
@react-native-community/eslint-config           0.0.5    0.0.5   2.0.0  global
@react-native-community/google-signin           4.0.3    4.0.3   5.0.0  global
@react-native-firebase/app                      8.4.7    8.4.7  10.8.1  global
@react-native-firebase/auth                     8.3.3    8.3.3  10.8.1  global
@react-native-firebase/dynamic-links           7.5.13   7.5.13  10.8.1  global
babel-jest                                     24.9.0   24.9.0  26.6.3  global
expo                                          38.0.11  38.0.11  40.0.1  global
expo-app-auth                                   9.1.1    9.1.1  10.0.0  global
expo-google-sign-in                             8.2.1    8.2.1   9.0.0  global
expo-updates                                   0.2.14   0.2.14   0.4.2  global
firebase                                        7.9.0    7.9.0   8.2.9  global
jest                                           25.2.7   25.2.7  26.6.3  global
metro-react-native-babel-preset                0.58.0   0.58.0  0.65.1  global
react                                         16.13.1  16.13.1  17.0.1  global
react-dom                                     16.11.0  16.11.0  17.0.1  global
react-native                                   0.63.3   0.63.3  0.63.4  global
react-native-permissions                        2.2.2    2.2.2   3.0.1  global
react-native-safe-area-context                  3.0.2    3.0.2   3.1.9  global
react-native-unimodules                        0.10.1   0.10.1  0.12.0  global
react-native-web                               0.11.7   0.11.7  0.15.0  global
react-test-renderer                           16.11.0  16.11.0  17.0.1  global``
- [x] running react-native ios fails:
``ld: warning: directory not found for option '-L-L/Users/retep/Library/Developer/Xcode/DerivedData/AmericanScoresApp-ekggsecaraotjqaswejufbfltlnu/Build/Products/Debug-iphonesimulator/AppAuth'
ld: library not found for -lAppAuth
clang: error: linker command failed with exit code 1 (use -v to see invocation)``
- [x] load workspace in xcode
- [x] bump iOS target to iOS 14.1
- [x] bump project format to xcode 12.0
- [x] bump Pods project from iOS 8.0 to 14.1.
- [x] perform a first-time build in xcode
Warnings that may be addressed in later builds
``Conversion to Swift 5 is available
Legacy build system will be removed in a future release.``
Issue 'A':
``Error: AppDelegame.m ... 'EXSplashScreen/EXSplashScreenService.h' file not found``
- [x] Run the build again. 
Issue 'B':
``AmericaScores-attendanceApp/src/config/ios/GoogleService-Info.plist:0: Reading data: The file GoogleService-Info.plist couldn't be opened because there is no such file.``
- [x] Verify the file is present in the project and build target selected. Re-Add it to the Project. Also add it to the Build Phases: Compile Sources list.
Check and remove any incorrect references ``example../src/config/..``
- [x] Select an appropriate build target and build again

- [x] Error: Folly/folly/synchronization/DistributedMutex-inl.h:1051:5: 'atomic_notify_one<unsigned long>' is unavailable
- [x] To fix this, first go to ProjectFolder/Pods/Headers/Private/Flipper-Folly/folly/synchronization/DistributedMutex-inl.h
- [x] Change the following lines in the DistributedMutex-inl.h file
Around line 1043 - change `atomic_notify_one(state);` to `folly::atomic_notify_one(state);`
Around line 1668 - change `auto result= atomic_wait_until(&state, previous | data, deadline);` to `auto result= folly::atomic_wait_until(&state, previous | data, deadline);`
