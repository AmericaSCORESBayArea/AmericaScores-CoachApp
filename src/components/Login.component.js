import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
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
import { GoogleSignin } from "@react-native-google-signin/google-signin";
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
import {
  changeRegion,
  changeRegionList,
  showFirstTimeModal,
} from "../Redux/actions/SessionScreen.actions";
import inAppMessaging from "@react-native-firebase/in-app-messaging";
import { paletteColors } from "./paletteColors";

const useInputState = (initialValue = "") => {
  const [value, setValue] = useState(initialValue);
  return { value, onChangeText: setValue };
};

const Header = (props) => (
  <View {...props}>
    <Text category="h6">Log in</Text>
    <Text category="s1">America SCORES Attendance</Text>
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
  const [loading, setLoading] = useState(false);
  //Auth
  // Handle the button press
  async function loginWithPhoneNumber() {
    try {
      setLoading(true);
      const confirmation = await auth()
        .signInWithPhoneNumber("+1" + loginPhoneNumber.value)
        .catch((e) => console.log(e));
      // console.log("Tried to log in", confirmation);
      await analytics().logEvent("LoginByPhone", {
        application: "Coach App",
      });
      dispatch(setPhoneAuthConfirmation(confirmation));
      setLoading(false);
      if (confirmation) navigation.navigate("PhoneLogin_code");
      else {
        setLoading(false);
        Alert.alert(
          "Verification Code Not sent",
          "Check the example phone number and try again. If the issue persists contact your SCORES Program Manager."
        );
        await analytics().logEvent("SMSFailed", {
          application: "Coach App",
        });
      }
    } catch (error) {
      setLoading(false);
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
                  If your phone number is registered with SCORES, we will send a
                  verification code to that number for you to use in the next
                  step.
                </Text>
                <Input
                  // style={styles.input}
                  keyboardType="numeric"
                  status="primary"
                  label="Phone number"
                  placeholder="6466600404 (numbers only)" //America scores phone
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
                    {loading ? "LOADING" : "SIGN IN WITH PHONE"}
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
  const showFirstTimeModal = useSelector(
    (state) => state.sessionScreen.showFirstTimeModal
  );
  const dispatch = useDispatch();
  const loginCode = useInputState();
  const [loading, setLoading] = useState(false);
  const [firstTimeModal, setFirstTimeModal] = useState(showFirstTimeModal);
  const clubSelected = async () => {
    dispatch(changeRegion("ASBA"));
    dispatch(
      changeRegionList([
        "All ASBA",
        "Alameda",
        "Daly City",
        "Hayward",
        "Marin",
        "Oakland",
        "Pajaro Valley Unified",
        "Redwood City",
        "San Francisco Civic Center",
        "San Francisco Crocker",
        "San Jose",
        "San Mateo",
        "San Rafael",
        "Santa Cruz",
        "West Contra Costa",
      ])
    );
    const aux = await AsyncStorage.getItem("customTheme");
    if (aux === null) {
      await AsyncStorage.setItem(
        "customTheme",
        JSON.stringify(paletteColors[0])
      );
    }
    let auxCalendar = await AsyncStorage.getItem("customCalendar");
    if (auxCalendar !== null) {
      //changing customCalendar value to the actual date/month/week
      let value = JSON.parse(auxCalendar).optionSelected;
      var start = null;
      var end = null;
      if (value === "T") {
        start = new Date(moment().subtract(7, "days"));
        end = new Date(moment().add(7, "days"));
      } else if (value === "M") {
        start = new Date(moment().startOf("month"));
        end = new Date(moment().endOf("month"));
      } else {
        start = new Date(moment().startOf("week"));
        end = new Date(moment().endOf("week"));
      }
      let calendarEdited = {
        optionSelected: value,
        startDate: start,
        endDate: end,
        textCalendar: JSON.parse(auxCalendar).textCalendar,
      };
      await AsyncStorage.setItem(
        "customCalendar",
        JSON.stringify(calendarEdited)
      );
    }
    const notifications = await AsyncStorage.getItem("appNotifications");
    if (notifications === null || notifications === "true") {
      inAppMessaging().setMessagesDisplaySuppressed(false);
      await inAppMessaging().triggerEvent("main_activity_ready");
    }
  };

  const onGuideModalClose = async () => {
    setFirstTimeModal(false);
    await clubSelected();
    navigation.navigate("HomeRoot", { screen: "Home" });
  };

  useEffect(() => {
    if (firstTimeModal) {
      navigation.navigate("userGuideModalLogin", {
        onModalClose: onGuideModalClose,
      });
    }
  }, [firstTimeModal, navigation]);

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
              // console.log("set userProfile", userProfile);
              await AsyncStorage.setItem("authServiceType", serviceProvider);
              await AsyncStorage.setItem("authIdentifier", userIdentifier);

              dispatch(loginUser(userProfile));
              dispatch(syncSessions(userSessions));
              setLoading(false);
              const notifications = await AsyncStorage.getItem(
                "appNotifications"
              );
              if (notifications === null || notifications === "true") {
                await analytics().logEvent("successfulLogin", {
                  coach_Id: userProfile.ContactId,
                  //club_Selected: region, -- not assigned yet?
                  application: "Coach App",
                });
              }
              setFirstTimeModal(true);
            })
            .catch((error) => {
              console.log(error);
              setLoading(false);
              _rollbackSetupUser();
            });
        } else {
          Alert.alert(
            "Not an America SCORES account",
            "This account apparently does not exist, please contact your SCORES Program Manager."
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
      Keyboard.dismiss();
      setLoading(true);
      const res = await state.confirmation.confirm(loginCode.value);
      let newPhoneNumber = res.user.phoneNumber;
      newPhoneNumber = newPhoneNumber.replace("+1", "");
      _setupUser(newPhoneNumber, "Phone");
    } catch (error) {
      console.log(error);
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
      firstDate: moment("20230101", "YYYYMMDD").format("YYYY-MM-DD"),
      secondDate: moment("20250615", "YYYYMMDD").format("YYYY-MM-DD"),
    },
  })
    .then((res) => res.data)
    .catch((e) => console.log(e));
};
