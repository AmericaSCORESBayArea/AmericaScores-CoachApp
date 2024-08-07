import React, { Component } from "react";
import {
  Alert,
  Image,
  ImageBackground,
  SafeAreaView,
  Linking,
  Platform,
} from "react-native";
import { Button, Layout, Text, Icon, Modal, Card } from "@ui-kitten/components";
import { StyleSheet, View } from "react-native";
import Axios from "axios";
import { ApiConfig } from "../config/ApiConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";

import moment from "moment";

import { GoogleSignin } from "@react-native-google-signin/google-signin";
import auth from "@react-native-firebase/auth";
import appleAuth, {
  AppleButton,
  AppleAuthRequestScope,
  AppleAuthRequestOperation,
} from "@invertase/react-native-apple-authentication";
import analytics from "@react-native-firebase/analytics";

import { connect } from "react-redux";
import { loginUser, logOutUser } from "../Redux/actions/user.actions";
import { syncSessions } from "../Redux/actions/Session.actions";
import { bindActionCreators } from "redux";
import {
  changeRegion,
  changeRegionList,
} from "../Redux/actions/SessionScreen.actions";
import { paletteColors } from "../components/paletteColors";
class LogInScreen_Google extends Component {
  constructor(props) {
    super(props);
    this.state = {
      logged: "false",
      email: "",
      loadingModalstate: false,
      responseStatusModal: false,
      region: this.props.sessionScreen.region || "ASBA",
      isUserFirstTime: this.props.sessionScreen.isUserFirstTime,
    };
  }

  clubSelected = async (region) => {
    this.props.actions.changeRegion(this.state.region);
    if (region === "ASBA") {
      this.props.actions.changeRegionList([
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
      ]);
    } else if (region === "IFC") {
      this.props.actions.dispatch(changeRegionList(["All IFC", "IFC-SF"]));
    } else if (region === "OGSC") {
      this.props.actions.dispatch(changeRegionList(["All OGSC", "Genesis"]));
    }
    // setTimeout(() => {
    //   console.log("region", this.props.sessionScreen.region);
    //   if (this.props.sessionScreen.region === null) {
    //     this.setState({ region: "ASBA" });
    //   } else {
    //     this.setState({ region: this.props.sessionScreen.region });
    //   }
    // }, 0);
    const customTheme = await AsyncStorage.getItem("customTheme");
    if (customTheme === null) {
      await AsyncStorage.setItem(
        "customTheme",
        JSON.stringify(paletteColors[0])
      );
    }
  };

  async componentDidMount() {
    this.setState({ loadingModalstate: true });

    try {
      const { actions, navigation } = this.props;
      const user = auth().currentUser;

      if (!user) {
        this.setState({ loadingModalstate: false, logged: "false" });
        navigation.navigate("MainLogin");
        return;
      }

      const authType = await AsyncStorage.getItem("authServiceType");
      const authIdentifier = await AsyncStorage.getItem("authIdentifier");

      if (!authType || !authIdentifier) {
        throw new Error("Authentication details are incomplete");
      }
      const identifier =
        authIdentifier.toLowerCase() === "phone"
          ? authIdentifier.replace("+1", "")
          : authIdentifier;

      const response = await Axios.get(`${ApiConfig.baseUrl}/auth/login`, {
        params: { useridentifier: identifier, serviceprovider: authType },
      });

      if (!response.data.ContactId) {
        throw new Error("No contact ID found");
      }

      await this.setLoginLocal(response.data.ContactId);
      await actions.loginUser(response.data);
      await analytics().logEvent("main_activity_ready");
      this.setState({
        logged: "true",
        loadingModalstate: false,
      });

      setTimeout(() => {
        this.setState({ region: this.props.sessionScreen.region });
      }, 0);

      if (this.state.isUserFirstTime === false) {
        await this.clubSelected(this.state.region);
        navigation.navigate("HomeRoot", { screen: "Home" });
      } else if (
        this.state.region === ("ASBA" || "IFC" || "OGSC") &&
        this.state.isUserFirstTime === true
      ) {
        navigation.navigate("Select_Club");
      }
    } catch (error) {
      console.error(error);
      this.setState({ loadingModalstate: false });
      this.initAsync();
    }
  }

  setLoginLocal = async (loginData) => {
    try {
      await AsyncStorage.setItem("loginData", loginData);
    } catch (err) {
      this.setState({ loadingModalstate: false });
      console.log(err);
    }
  };

  dispatchUser = async (userProfile) => {
    await loginUser(userProfile);
  };

  initAsync = async () => {
    // console.log("initAsync");
    const id =
      Platform.OS === "ios"
        ? "688897090799-n7llvrfrib6aalpr149vttvbuigs49r5.apps.googleusercontent.com"
        : "688897090799-bjjppfthi3oac16o523ht01h63lnaout.apps.googleusercontent.com";
    GoogleSignin.configure({
      scopes: ["email"],
      webClientId: id,
    });
    // await GoogleSignin.initAsync({
    //   clientId: id,
    // });
    try {
      const loggedStat = await AsyncStorage.getItem("loggedStatus");
      const email = await AsyncStorage.getItem("userAppleEmail");
      // console.log("loggedStat", loggedStat, email);
      if (loggedStat) {
        this.setState({ logged: loggedStat });
        this.setState({ email: email });
      }
    } catch (e) {
      console.log("loggedStatus error", e);
      this.setState({ loadingModalstate: false });
      // error reading value
    }
  };

  _setupUser = async (userIdentifier, serviceProvider) => {
    const { actions, navigation } = this.props;
    // console.log("setupUser", userIdentifier, serviceProvider);

    Axios.get(`${ApiConfig.baseUrl}/auth/login`, {
      params: {
        useridentifier: userIdentifier,
        serviceprovider: serviceProvider,
      },
    })
      .then(async (response) => {
        const userProfile = response.data;
        if (userProfile.ContactId) {
          await AsyncStorage.setItem("authServiceType", serviceProvider);
          await AsyncStorage.setItem("authIdentifier", userIdentifier);

          this.setState({ logged: "true" });
          this._syncUserSessions(userProfile)
            .then(async (userSessions) => {
              actions.loginUser(userProfile);
              actions.syncSessions(userSessions);
              await this.clubSelected("ASBA");
              navigation.navigate("HomeRoot", { screen: "Home" });
            })
            .catch((error) => {
              console.log("_setupUser", error);
              this._rollbackSetupUser();
            });
        } else {
          this.setState({ responseStatusModal: true });
          return this._rollbackSetupUser();
        }
      })
      .catch(async (error) => {
        await AsyncStorage.removeItem("authServiceType");
        console.log("setupUser error", error);
        this.setState({ responseStatusModal: true }), console.log(error);
      });
  };

  _rollbackSetupUser = async () => {
    const { actions } = this.props;
    await GoogleSignin.signOut();
    // console.log("rollback setup user");
    actions.logOutUser();
  };

  signInAsync = async () => {
    try {
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });
      const { idToken } = await GoogleSignin.signIn();

      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      const { user } = await auth().signInWithCredential(googleCredential);

      this._setupUser(user.email, "google");
    } catch ({ message }) {
      alert("login: Error:" + message);
      return;
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
      // console.log("apple auth route", this.state.email);
      this._setupUser(this.state.email, "email");
    } else {
      // console.log(this.state.email, this.state.logged);
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
          requestedOperation: appleAuth.Operation.LOGIN,
          requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
        });
        console.log(appleAuthRequestResponse);
        // Ensure Apple returned a user identityToken
        if (!appleAuthRequestResponse.identityToken)
          this.setState({ responseStatusModal: true });

        // if (!appleAuthRequestResponse.email) {
        //   Alert.alert(
        //     "Log in error",
        //     `We need your email to log you in. Do NOT press "Hide email" please.`
        //   );
        // } else {
        //   console.log("email: " + appleAuthRequestResponse.email);
        //   this.setState({ email: appleAuthRequestResponse.email });

        //   await AsyncStorage.setItem("userAppleEmail", this.state.email);

        //   console.log("[APPLE LOGIN] Successful request");
        // }

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
        console.log(appleCredential);

        // Sign the user in with the credential
        const response = await auth().signInWithCredential(appleCredential);
        console.log(response);
        if (!response) {
          Alert.alert(
            "Log in error",
            `Apple log in failed, try another method or try later.`
          );
          throw "[APPLE LOGIN | ERROR] in signInWithCredentials";
        } else console.log("[APPLE LOGIN] signed In with credentials");

        let fbUser = auth().currentUser;
        if (!fbUser || !fbUser.email || fbUser.email.length === 0) {
          Alert.alert(
            "Log in error",
            `We need your email to log you in. Do NOT press "Hide email" please.`
          );
          try {
            await auth().signOut();
            // console.log("[APPLE LOGIN] signed out");
          } catch (error) {
            console.log("[APPLE LOGIN] error signing out", error);
          }
          return;
        } else {
          // console.log("email: " + fbUser.email);
          this.setState({ email: fbUser.email });

          await AsyncStorage.setItem("userAppleEmail", this.state.email);

          // console.log("[APPLE LOGIN] Successful request");
        }

        //TODO Change the gmail for email in backend
        this._setupUser(fbUser.email, "email");
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
  sessionScreen: state.sessionScreen,
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(
    {
      loginUser,
      logOutUser,
      syncSessions,
      changeRegion,
      changeRegionList,
    },
    dispatch
  ),
  dispatch,
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
