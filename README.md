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

### Frecuent errors

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