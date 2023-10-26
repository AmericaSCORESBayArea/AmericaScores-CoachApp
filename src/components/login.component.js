import React, { useState } from "react";
import {
  SafeAreaView,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import {
  Button,
  Layout,
  Icon,
  Input,
  Text,
  Card,
  Spinner,
} from "@ui-kitten/components";
import { View } from "react-native";
import auth from "@react-native-firebase/auth";
import { ApiConfig } from "../config/ApiConfig";
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import moment from "moment";
import { useSelector, useDispatch } from "react-redux";
import {
  loginUser,
  logOutUser,
  setPhoneAuthConfirmation,
} from "../Redux/actions/user.actions";
import { syncSessions } from "../Redux/actions/Session.actions";
import Axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import analytics from "@react-native-firebase/analytics";

const useInputState = (initialValue = "") => {
  const [value, setValue] = React.useState(initialValue);
  return { value, onChangeText: setValue };
};

const Header = (props) => (
  <View {...props}>
    <Text category="h6">Log in</Text>
    <Text category="s1">America Scores Attendance</Text>
  </View>
);

const PhoneIcon = (props) => <Icon {...props} name="phone-outline" />;
const BackArrrowIcon = (props) => (
  <Icon {...props} name="arrow-ios-back-outline" />
);
const LoadingIndicator = (props) => (
  <View
    style={[props.style, { justifyContent: "center", alignItems: "center" }]}
  >
    <Spinner size="small" status="basic" />
  </View>
);

export const LogInScreen_PhoneAuth_Phone = ({ navigation }) => {
  const dispatch = useDispatch();
  const loginPhoneNumber = useInputState("");
  //Auth
  // Handle the button press
  async function loginWithPhoneNumber() {
    try {
      const confirmation = await auth()
        .signInWithPhoneNumber("+1" + loginPhoneNumber.value)
        .catch((e) => console.log(e));
      console.log("Tryed to log in", confirmation);
      dispatch(setPhoneAuthConfirmation(confirmation));
      if (confirmation) navigation.navigate("PhoneLogin_code");
      else
        Alert.alert(
          "SMS Not sent",
          "Check the example phone number and try again. If the issue persists contact your Salesforce administrator."
        );
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <Layout style={{ flex: 1 }} level="4">
        <SafeAreaView
          forceInset={{ top: "always", bottom: "never" }}
          style={{ flex: 1 }}
        >
          <Layout
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
            level="4"
          >
            <Layout
              style={{ padding: "5%", width: "100%", height: "100%" }}
              level="4"
            >
              <Card
                style={{ flex: 1 }}
                status="primary"
                header={Header}
                onPress={Keyboard.dismiss}
              >
                <Text style={{ paddingBottom: "5%" }}>
                  We will send verification SMS code to the following phone
                  number.
                </Text>
                <Input
                  // style={styles.input}
                  keyboardType="numeric"
                  status="primary"
                  label="Phone number"
                  placeholder="646 660 0404" //America scores phone
                  {...loginPhoneNumber}
                />
              </Card>
              <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "position" : null}
                keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
              >
                <Layout
                  style={{ justifyContent: "center", alignItems: "center" }}
                >
                  <Button
                    style={{ width: "100%" }}
                    accessoryLeft={BackArrrowIcon}
                    appearance="ghost"
                    status="basic"
                    onPress={() => navigation.goBack()}
                  >
                    GO BACK
                  </Button>
                  <Button
                    style={{ width: "100%" }}
                    accessoryLeft={PhoneIcon}
                    status="primary"
                    onPress={() => loginWithPhoneNumber(navigation)}
                  >
                    SIGN IN WITH PHONE
                  </Button>
                </Layout>
              </KeyboardAvoidingView>
            </Layout>
          </Layout>
        </SafeAreaView>
      </Layout>
    </TouchableWithoutFeedback>
  );
};

export const LogInScreen_PhoneAuth_Code = ({ navigation }) => {
  const state = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const loginCode = useInputState();
  const [loading, setLoading] = useState(false);

  async function _setupUser(userIdentifier, serviceProvider) {
    await Axios.get(`${ApiConfig.baseUrl}/auth/login`, {
      params: {
        useridentifier: userIdentifier,
        serviceprovider: serviceProvider,
      },
    })
      .then(async (res) => {
        if (res.status === 200)
          console.log("[AUTH FETCH MOBILE LOGIN | 200]", res.data);
        const userProfile = res.data;
        await setLoginLocal(userProfile.ContactId);
        if (userProfile.ContactId) {
          //Axios.defaults.headers.common['client_id'] = ApiConfig.clientIdSandbox;
          //Axios.defaults.headers.common['client_secret'] = ApiConfig.clientSecretSandbox;
          _syncUserSessions(userProfile)
            .then(async (userSessions) => {
              dispatch(loginUser(userProfile));
              dispatch(syncSessions(userSessions));
              setLoading(false);
              const notifications = await AsyncStorage.getItem(
                "appNotifications"
              );
              if (notifications === null || notifications === "true") {
                await analytics().logEvent("main_activity_ready");
              }
              navigation.navigate("Select_Club");
            })
            .catch((error) => {
              console.log(error);
              setLoading(false);
              _rollbackSetupUser();
            });
        } else {
          Alert.alert(
            "Not an America Scores account",
            "This account apparently does not exist, please contact your Salesforce administrator."
          );
          console.log("[AUTH FETCH ISSUE NO userProfile", res.data);
          return _rollbackSetupUser();
        }
      })
      .catch((error) => {
        setLoading(false);
        console.log("[AUTH ERROR] SOMETHING ELSE HAPPENED", error);
        Alert.alert("[AUTH ERROR]", "API CONFIGS NOT PROVIDED");
      });
  }

  async function setLoginLocal(loginData) {
    try {
      await AsyncStorage.setItem("loginData", loginData);
    } catch (err) {
      console.log(err);
    }
  }

  async function confirmCode() {
    try {
      setLoading(true);
      const res = await state.confirmation.confirm(loginCode.value);
      let newPhoneNumber = res.user.phoneNumber;
      newPhoneNumber = newPhoneNumber.replace("+1", "");
      _setupUser(newPhoneNumber, "Phone");
    } catch (error) {
      setLoading(false);
      Alert.alert(
        "Login error: Invalid code",
        "The code entered is invalid, please check your SMS message again."
      );
    }
  }

  const _rollbackSetupUser = async () => {
    await GoogleSignin.signOut();
    dispatch(logOutUser());
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <Layout style={{ flex: 1 }} level="4">
        <SafeAreaView
          forceInset={{ top: "always", bottom: "never" }}
          style={{ flex: 1 }}
        >
          <Layout
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
            level="4"
          >
            <Layout
              style={{ padding: "5%", width: "100%", height: "100%" }}
              level="4"
            >
              <Card
                style={{ flex: 1 }}
                status="primary"
                header={Header}
                onPress={Keyboard.dismiss}
              >
                <Text style={{ paddingBottom: "5%" }}>
                  Insert the received code
                </Text>
                <Input
                  // style={styles.input}
                  keyboardType="numeric"
                  status="primary"
                  label="Code"
                  placeholder="123456" //America scores phone
                  {...loginCode}
                />
              </Card>
              <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "position" : null}
                keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
              >
                <Layout
                  style={{ justifyContent: "center", alignItems: "center" }}
                >
                  <Button
                    style={{ width: "100%" }}
                    accessoryLeft={BackArrrowIcon}
                    appearance="ghost"
                    status="basic"
                    onPress={() => navigation.goBack()}
                  >
                    GO BACK
                  </Button>
                  <Button
                    style={{ width: "100%" }}
                    accessoryLeft={loading ? LoadingIndicator : PhoneIcon}
                    status="primary"
                    onPress={() => confirmCode()}
                  >
                    {loading ? "LOADING" : "CONTINUE"}
                  </Button>
                </Layout>
              </KeyboardAvoidingView>
            </Layout>
          </Layout>
        </SafeAreaView>
      </Layout>
    </TouchableWithoutFeedback>
  );
};

const _syncUserSessions = async (user) => {
  Axios.get(`${ApiConfig.dataApi}/coach/${user.ContactId}/all`, {
    params: {
      firstDate: moment("20210416", "YYYYMMDD").format("YYYY-MM-DD"),
      secondDate: moment("20210426", "YYYYMMDD").format("YYYY-MM-DD"),
    },
  })
    .then((res) => res.data)
    .catch((e) => console.log(e));
};
