import React, { Component } from "react";
import {
  Alert,
  Image,
  ImageBackground,
  SafeAreaView,
  Linking,
} from "react-native";
import { Button, Layout, Text, Icon, Modal, Card } from "@ui-kitten/components";
import { StyleSheet, View } from "react-native";
import Axios from "axios";
import { ApiConfig } from "../config/ApiConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";

import moment from "moment";

import * as GoogleSignIn from "expo-google-sign-in";
import auth from "@react-native-firebase/auth";
import appleAuth, {
  AppleButton,
  AppleAuthRequestScope,
  AppleAuthRequestOperation,
} from "@invertase/react-native-apple-authentication";
import analytics from "@react-native-firebase/analytics";

import { connect } from "react-redux";
import { loginUser, logOutUser } from "../Redux/actions/user.actions";
import { useDispatch } from "react-redux";
import { syncSessions } from "../Redux/actions/Session.actions";
import { bindActionCreators } from "redux";

class LogInScreen_Google extends Component {
  constructor(props) {
    super(props);
    this.state = {
      logged: "false",
      email: "",
      loadingModalstate: false,
      responseStatusModal: false,
    };
  }

  async componentDidMount() {
    this.setState({ loadingModalstate: true });
    const { actions, navigation } = this.props;
    const user = await auth().currentUser;
    console.log(user);
    if (user) {
      const number = user.phoneNumber.replace("+1", "");
      await Axios.get(`${ApiConfig.baseUrl}/auth/login`, {
        params: {
          useridentifier: number,
          serviceprovider: "Phone",
        },
      }).then(async (res) => {
        if (res.status === 200)
          console.log("[AUTH FETCH MOBILE LOGIN | 200]", res.data);
        const userProfile = res.data;
        if (res.data.ContactId === null) {
          this.setState({ loadingModalstate: false });
          this.initAsync();
        } else {
          await this.setLoginLocal(userProfile.ContactId);
          if (userProfile.ContactId) {
            //Axios.defaults.headers.common['client_id'] = ApiConfig.clientIdSandbox;
            //Axios.defaults.headers.common['client_secret'] = ApiConfig.clientSecretSandbox;
            // dispatch(loginUser(userProfile));
            await actions.loginUser(userProfile);
            this.setState({ logged: "true" });
            await analytics().logEvent("main_activity_ready");
            navigation.navigate("Select_Club");
            this.setState({ loadingModalstate: false });
          }
        }
      });
    } else {
      this.setState({ loadingModalstate: false });
      this.initAsync();
    }
  }

  setLoginLocal = async (loginData) => {
    try {
      await AsyncStorage.setItem("loginData", loginData);
    } catch (err) {
      console.log(err);
    }
  };

  dispatchUser = async (userProfile) => {
    await loginUser(userProfile);
  };

  initAsync = async () => {
    await GoogleSignIn.initAsync({
      clientId:
        "688897090799-99bi882h4pkc3vkksl71mm387lgvd2lp.apps.googleusercontent.com",
    });
    try {
      const loggedStat = await AsyncStorage.getItem("loggedStatus");
      const email = await AsyncStorage.getItem("userAppleEmail");
      if (loggedStat !== null) {
        console.log(email);
        this.setState({ logged: loggedStat });
        this.setState({ email: email });
      }
    } catch (e) {
      // error reading value
    }
  };

  _syncUserWithStateAsync = async () => {
    const loggedUser = await GoogleSignIn.signInSilentlyAsync();
    if (loggedUser !== null) this._setupUser(loggedUser.email, "google");
  };

  _setupUser = async (userIdentifier, serviceProvider) => {
    const { actions, navigation } = this.props;

    Axios.get(`${ApiConfig.baseUrl}/auth/login`, {
      params: {
        useridentifier: userIdentifier,
        serviceprovider: serviceProvider,
      },
    })
      .then((response) => {
        const userProfile = response.data;
        if (userProfile.ContactId) {
          console.log(userProfile);
          this.setState({ logged: "true" });
          this._syncUserSessions(userProfile)
            .then((userSessions) => {
              console.log(userSessions);
              actions.loginUser(userProfile);
              actions.syncSessions(userSessions);
              navigation.navigate("Select_Club");
            })
            .catch((error) => {
              console.log(error);
              this._rollbackSetupUser();
            });
        } else {
          this.setState({ responseStatusModal: true });
          return _rollbackSetupUser();
        }
      })
      .catch((error) => this.setState({ responseStatusModal: true }));
  };

  _rollbackSetupUser = async () => {
    const { actions } = this.props;
    await GoogleSignIn.signOutAsync();
    actions.logOutUser();
  };

  signInAsync = async () => {
    try {
      await GoogleSignIn.askForPlayServicesAsync();
      const { type, user } = await GoogleSignIn.signInAsync();
      if (type === "success") this._syncUserWithStateAsync();
    } catch ({ message }) {
      alert("login: Error:" + message);
    }
  };

  signInGoogle = () => {
    if (this.props.user.logged) {
      this._rollbackSetupUser();
    } else {
      this.signInAsync();
    }
  };

  appleAlert = () => {
    if (this.state.logged === "true" && this.state.email !== null) {
      this._setupUser(this.state.email, "email");
    } else {
      console.log(this.state.email, this.state.logged);
      Alert.alert(
        "Alert Title",
        "An America Scores account is not found linked to this Apple ID. Choose [Continue] to proceed and link or create your America Scores account. Your Apple ID will remain anonymous",
        [
          {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel",
          },
          { text: "Continue", onPress: () => this.signInApple() },
        ],
        { cancelable: false }
      );
    }
  };

  signInApple = async () => {
    console.log("[APPLE LOGIN | Start]");
    try {
      if (this.state.logged === "true") {
        this._setupUser(this.state.email, "email");
      } else {
        const appleAuthRequestResponse = await appleAuth.performRequest({
          requestedOperation: AppleAuthRequestOperation.LOGIN,
          requestedScopes: [
            AppleAuthRequestScope.EMAIL,
            AppleAuthRequestScope.FULL_NAME,
          ],
        });

        // Ensure Apple returned a user identityToken
        if (!appleAuthRequestResponse.identityToken)
          this.setState({ responseStatusModal: true });

        if (!appleAuthRequestResponse.email) {
          Alert.alert(
            "Log in error",
            `We need your email to log you in. Do NOT press "Hide email" please.`
          );
        } else {
          console.log("email: " + appleAuthRequestResponse.email);
          this.setState({ email: appleAuthRequestResponse.email });

          await AsyncStorage.setItem("userAppleEmail", this.state.email);

          console.log("[APPLE LOGIN] Successful request");
        }

        // Create a Firebase credential from the response
        const { identityToken, nonce } = appleAuthRequestResponse;
        const appleCredential = auth.AppleAuthProvider.credential(
          identityToken,
          nonce
        );

        if (!appleCredential) {
          Alert.alert(
            "Log in error",
            `Apple log in failed, try another method or try later.`
          );
          throw "[APPLE LOGIN | ERROR] in appleCredential";
        } else console.log("[APPLE LOGIN] got appleCredential ");

        // Sign the user in with the credential
        const response = auth().signInWithCredential(appleCredential);
        if (!response) {
          Alert.alert(
            "Log in error",
            `Apple log in failed, try another method or try later.`
          );
          throw "[APPLE LOGIN | ERROR] in signInWithCredentials";
        } else console.log("[APPLE LOGIN] signed In with credentials");

        //TODO Change the gmail for email in backend
        this._setupUser(appleAuthRequestResponse.email, "email");
      }
    } catch (error) {
      this.setState({ responseStatusModal: true });
      console.log("[APPLE LOGIN ERROR]", error);
    }
  };

  async _syncUserSessions(user) {
    Axios.get(`${ApiConfig.dataApi}/coach/${user.ContactId}/all`, {
      params: {
        firstDate: moment("20210416", "YYYYMMDD").format("YYYY-MM-DD"),
        secondDate: moment("20210426", "YYYYMMDD").format("YYYY-MM-DD"),
      },
    })
      .then((res) => res.data)
      .catch((e) => console.log(e));
  }

  LoadingGif = () => {
    return require("../../assets/Scores_Logo.gif"); //Scores logo gif
  };
  toggleNotificationOff = () => {
    this.setState({ responseStatusModal: false });
  };
  render() {
    const { navigation } = this.props;
    const loadingModal = () => (
      <Modal
        style={styles.popOverContent}
        visible={this.state.loadingModalstate}
        backdropStyle={styles.backdrop}
      >
        <Image source={this.LoadingGif()} />
      </Modal>
    );
    const Footer = (props) => (
      <Layout {...props}>
        <Button
          appearance="ghost"
          status="danger"
          onPress={() => this.toggleNotificationOff()}
        >
          Cancel
        </Button>
        <Button
          onPress={() => {
            Linking.openURL(ApiConfig.scoresuURL), this.toggleNotificationOff();
          }}
        >
          Get Started
        </Button>
      </Layout>
    );
    const UnsuccessHeader = (props) => (
      <Layout {...props}>
        <Text
          category="h4"
          appearance="hint"
          status="danger"
          style={{ alignSelf: "center", marginTop: "2%" }}
        >
          Login Error
        </Text>
      </Layout>
    );
    const errorModal = () => (
      <Modal
        visible={this.state.responseStatusModal}
        style={{ width: "80%" }}
        backdropStyle={styles.backdrop}
        onBackdropPress={() => this.toggleNotificationOff()}
      >
        <Card disabled={true} header={UnsuccessHeader} footer={Footer}>
          <Text
            status={"danger"}
            style={{ margin: 15, alignSelf: "center", textAlign: "justify" }}
          >
            This account apparently does not exist, please contact your Scores
            administrator or select [Get Started] to begin the process of
            registering as a Scores Coach today.
          </Text>
        </Card>
      </Modal>
    );
    const Header = (props) => (
      <View {...props} style={{ margin: "3%" }}>
        <Text category="h6">Log in</Text>
        <Text category="s1">America Scores Attendance APP</Text>
      </View>
    );
    const PhoneIcon = (props) => <Icon {...props} name="phone" />;
    const GoogleIcon = (props) => <Icon {...props} name="google" />;
    const AppleIcon = (props) => <Icon {...props} name="external-link" />;
    const BackArrrowIcon = (props) => (
      <Icon {...props} name="arrow-ios-back-outline" />
    );

    return (
      <Layout style={{ flex: 1 }} level="4">
        <ImageBackground
          source={require("../../assets/LogInBackground.jpeg")}
          style={{ flex: 1 }}
        >
          {loadingModal()}
          {errorModal()}
          <SafeAreaView style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }}>
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Layout
                style={{
                  width: "100%",
                  height: "100%",
                  backgroundColor: "rgba(0,0,0,0)",
                }}
                level="4"
              >
                <Layout
                  style={{ flex: 1, margin: "5%", opacity: 0.85 }}
                  status="basic"
                  header={Header}
                >
                  {Header()}
                  <View style={{ flex: 1, margin: "5%" }}>
                    <Image
                      source={require(`../../assets/ASBA_Logo.png`)}
                      style={styles.image}
                    />
                  </View>
                  <Layout
                    style={{ justifyContent: "center", alignItems: "center" }}
                  >
                    <Button
                      style={{ width: "100%" }}
                      accessoryLeft={PhoneIcon}
                      appearance="ghost"
                      status="primary"
                      onPress={() => navigation.navigate("PhoneLogin_phone")}
                    >
                      SIGN IN WITH PHONE
                    </Button>
                    <Button
                      style={{ width: "100%" }}
                      accessoryLeft={GoogleIcon}
                      appearance="ghost"
                      status="danger"
                      onPress={() => this.signInGoogle()}
                    >
                      SIGN IN WITH GOOGLE
                    </Button>
                    {appleAuth.isSupported && (
                      <AppleButton
                        buttonStyle={AppleButton.Style.BLACK}
                        buttonType={AppleButton.Type.SIGN_IN}
                        style={{
                          width: "100%",
                          height: 50,
                        }}
                        onPress={() => this.appleAlert()}
                      />
                    )}
                  </Layout>
                </Layout>
              </Layout>
            </View>
          </SafeAreaView>
        </ImageBackground>
      </Layout>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user,
  sessions: state.sessions,
});

const ActionCreators = Object.assign(
  {},
  { loginUser, logOutUser, syncSessions }
);

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(ActionCreators, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(LogInScreen_Google);

const styles = StyleSheet.create({
  popOverContent: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    shadowRadius: 10,
    shadowOpacity: 0.12,
    shadowColor: "#000",
  },
  image: {
    flex: 1,
    width: null,
    height: null,
    resizeMode: "contain",
    opacity: 0.8,
  },
  loginTittle: {
    margin: "5%",
  },
  backdrop: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
});
