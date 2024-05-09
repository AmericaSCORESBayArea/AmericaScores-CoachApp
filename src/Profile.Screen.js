import React, { Component, createRef } from "react";
import {
  Modal,
  Card,
  Layout,
  Icon,
  Text,
  Button,
  ButtonGroup,
} from "@ui-kitten/components";
import {
  TouchableOpacity,
  View,
  StyleSheet,
  Image,
  ScrollView,
  Platform,
  PermissionsAndroid,
} from "react-native";
import { Avatar, Overlay } from "react-native-elements";
import Carousel, { Pagination } from "react-native-snap-carousel";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import { connect } from "react-redux";
import { syncSessions } from "./Redux/actions/Session.actions";
import { updateFirstTimeLoggedIn } from "./Redux/actions/user.actions";
import { bindActionCreators } from "redux";
import { paletteColors } from "./components/paletteColors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import { RequestDeleteAccount } from "./utils/RequestDeleteAccount";
import { changeRegion } from "./Redux/actions/SessionScreen.actions";
import { logOutUser } from "./Redux/actions/user.actions";
import moment from "moment";

class ProfileScreen extends Component {
  constructor(props) {
    super(props);
    this._carousel = createRef();
    this.state = {
      firstName: this.props.user.user.FirstName,
      lastName: this.props.user.user.LastName,
      visible: false,
      visibility: false,
      image: "",
      coloroverlayvisibility: false,
      homeScreenvisibilityModal: false,
      selected: null,
      activeItem: "",
      activeSlide: 0,
      slider1Ref: "",
      changedColor: false,
      changedHomeOption: false,
      homeScreenOptionSelected: 0,
      loadingModalstate: false,
      visibleEditCalendar: false,
      textCalendar: "",
      calendarOptionSelected: "",
      changedCalendar: false,
      homeScreenOptions: [
        {
          id: 0,
          title: "Sessions screen",
          icon: "calendar-outline",
        },
        {
          id: 1,
          title: "Teams screen",
          icon: "people-outline",
        },
      ],
    };
  }
  async componentDidMount() {
    let aux = await AsyncStorage.getItem("customTheme");
    let auxCalendar = await AsyncStorage.getItem("customCalendar");
    if (auxCalendar !== null) {
      this.setState({
        calendarOptionSelected: JSON.parse(auxCalendar).optionSelected,
        textCalendar: JSON.parse(auxCalendar).textCalendar,
      }); //change
    }
    if (aux !== null) {
      let change = await this.setState({ selected: JSON.parse(aux).id });
    }
    const unsubscribe = await AsyncStorage.getItem("customHomeScreen");
    if (unsubscribe === undefined) {
      this.setState({ homeScreenOptionSelected: 0 });
    } else {
      if (JSON.parse(unsubscribe) === null) {
        this.setState({ homeScreenOptionSelected: 0 });
      } else {
        this.setState({ homeScreenOptionSelected: JSON.parse(unsubscribe).id });
      }
    }
  }
  _renderItem = ({ item, index }) => {
    const getImage = () => {
      if (item.id === 0) {
        return require("../assets/Sessions/Color0.jpeg");
      } else if (item.id === 1) {
        return require("../assets/Sessions/Color1.jpeg");
      } else if (item.id === 2) {
        return require("../assets/Sessions/Color2.jpeg");
      } else if (item.id === 3) {
        return require("../assets/Sessions/Color3.jpeg");
      } else {
        return require("../assets/Sessions/Color4.jpeg");
      }
    };
    return (
      <React.Fragment>
        <ScrollView style={{ flex: 1 }}>
          <View style={{ flexDirection: "row" }}>
            <Text
              style={{
                alignSelf: "center",
                textAlign: "center",
                marginLeft: "25%",
                marginRight: "16%",
              }}
              category="h6"
            >
              Select a Theme
            </Text>
            <TouchableOpacity
              style={{
                alignSelf: "flex-end",
                marginTop: "1%",
                marginLeft: "3%",
              }}
              onPress={() =>
                this.setState({ coloroverlayvisibility: false, activeSlide: 0 })
              }
            >
              <EvilIcons name={"close"} size={30} color={"#5D738B"} />
            </TouchableOpacity>
          </View>
          <Image
            source={getImage()}
            style={{
              height: 350,
              width: 300,
              resizeMode: "contain",
              alignSelf: "center",
            }}
          />
          <View style={{ marginTop: 2 }}>
            <View
              style={{
                borderBottomColor: "black",
                borderBottomWidth: 1,
                marginBottom: "5%",
                marginLeft: "1%",
                marginRight: "1%",
              }}
            />
            <View
              style={{
                flexDirection: "row",
                alignSelf: "center",
                marginTop: "2%",
                marginBottom: "auto",
              }}
            >
              <View
                style={{
                  backgroundColor: item.color1,
                  width: 80,
                  height: 40,
                  alignSelf: "center",
                }}
              />
              <View
                style={{
                  backgroundColor: item.color2,
                  width: 80,
                  height: 40,
                  alignSelf: "center",
                }}
              />
              <View
                style={{
                  backgroundColor: item.color3,
                  width: 80,
                  height: 40,
                  alignSelf: "center",
                }}
              />
            </View>
          </View>
        </ScrollView>
      </React.Fragment>
    );
  };
  get pagination() {
    const { activeSlide } = this.state;
    return (
      <Pagination
        dotsLength={paletteColors.length}
        activeDotIndex={activeSlide}
        carouselRef={this._carousel}
        tappableDots={!!this._carousel}
        dotStyle={{
          width: 10,
          height: 10,
          borderRadius: 5,
          marginHorizontal: 8,
          backgroundColor: "rgba(0, 0, 0, 0.75)",
        }}
        inactiveDotStyle={{
          backgroundColor: "rgba(0, 0, 0, 0.75)",
        }}
        inactiveDotOpacity={0.4}
        inactiveDotScale={0.6}
      />
    );
  }
  onPressChangeTheme = () => {
    this.setState({ selected: this.state.activeSlide }),
      setTimeout(() => this.setState({ changedColor: true }), 500);
    setTimeout(() => {
      this.setState({ changedColor: false });
    }, 3500);
    paletteColors.map(async (value) => {
      if (value.id === this.state.activeSlide) {
        await AsyncStorage.setItem("customTheme", JSON.stringify(value));
        //let aux= await AsyncStorage.getItem('customTheme')
        //console.log(JSON.parse(aux).id)
        //await AsyncStorage.removeItem('customTheme');
      }
    });
  };

  deleteAccount = () => {
    const { actions } = this.props;
    this.setState({ loadingModalstate: true });
    RequestDeleteAccount(
      () => this.setState({ visible: false }),
      this.props.user.user,
      () => this.setState({ loadingModalstate: false }),
      () => actions.logOutUser(),
      () => actions.changeRegion(null),
      () => this.prop.navigation.navigate("Login")
    );
  };

  onPressChangeHomeScreen = async (value) => {
    this.setState({ homeScreenOptionSelected: value.id }),
      setTimeout(() => this.setState({ changedHomeOption: true }), 500);
    setTimeout(() => {
      this.setState({ changedHomeOption: false });
    }, 3500);
    await AsyncStorage.setItem("customHomeScreen", JSON.stringify(value));
  };

  onPressEditCalendar = async (value, text) => {
    var start = null;
    var end = null;
    this.setState({ calendarOptionSelected: value });
    if (value === "T") {
      start = new Date(moment());
      end = new Date(moment());
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
      textCalendar: text,
    };
    await AsyncStorage.setItem(
      "customCalendar",
      JSON.stringify(calendarEdited)
    );
    this.setState({ changedCalendar: true });
    setTimeout(() => {
      this.setState({ changedCalendar: false });
    }, 3500);
  };

  containerColor() {
    if (this.state.selected === 0) {
      return "#3D7C99";
    } else if (this.state.selected === 1) {
      return "#2179ad";
    } else if (this.state.selected === 2) {
      return "#1F0318";
    } else if (this.state.selected === 3) {
      return "#172B52";
    } else if (this.state.selected === 4) {
      return "#482728";
    } else {
      return "#3D7C99";
    }
  }

  render() {
    const cameraIcon = (props) => <Icon {...props} name="camera-outline" />;
    const homeIcon = (props) => <Icon {...props} name="home-outline" />;
    const editIcon = (props) => (
      <Icon {...props} name="color-palette-outline" />
    );
    const calendaroutline = (props) => (
      <Icon {...props} name="calendar-outline" />
    );
    const checkboxPassive = (props) => (
      <Icon
        {...props}
        name="checkmark-square-2-outline"
        fill="#808080"
        style={{ height: 50, width: 50 }}
      />
    );
    const checkboxActive = (props) => (
      <Icon
        {...props}
        name="checkmark-square-2-outline"
        fill="#4CBB17"
        style={{ height: 50, width: 50 }}
      />
    );
    const saveCameraImage = () => {
      let options = {
        storageOptions: {
          mediaType: "photo",
          cameraType: "front",
          path: "images",
        },
      };
      launchCamera(options, (response) => {
        if (response.didCancel) {
          console.log("User cancelled image picker");
        } else if (response.error) {
          console.log("ImagePicker Error: ", response.error);
        } else {
          this.setState({ image: response });
        }
      });
    };
    const requestCameraPermission = async () => {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: "App Camera Permission",
            message: "App needs access to your camera ",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK",
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log("Camera permission given");
          saveCameraImage();
        } else {
          console.log("Camera permission denied");
        }
      } catch (err) {
        console.warn(err);
      }
    };
    const getImage = () => {
      return require("../assets/user.png");
    };
    const chooseImage = () => {
      this.setState({ visibility: false });
      let options = {
        storageOptions: {
          skipBackup: true,
          path: "images",
        },
      };
      launchImageLibrary(options, (response) => {
        if (response.didCancel) {
          console.log("User cancelled image picker");
        } else if (response.error) {
          console.log("ImagePicker Error: ", response.error);
        } else {
          this.setState({ image: response });
          console.log(response);
        }
      });
    };
    const openCamera = () => {
      this.setState({ visibility: false });
      if (Platform.OS === "ios") {
        saveCameraImage();
      } else {
        requestCameraPermission();
      }
    };

    const LoadingGif = () => {
      if (this.props.sessionScreen.region === "ASBA") {
        return require("../assets/Scores_Logo.gif"); //Scores logo gif
      } else if (this.props.sessionScreen.region === "IFC") {
        return require("../assets/IFC_Logo_animated.gif"); //IFC logo gif
      } else if (this.props.sessionScreen.region === "OGSC") {
        return require("../assets/OGSC_logo_spinner.gif"); //Genesis logo gif
      }
    };

    const loadingModal = () => (
      <Modal
        style={styles.popOverContent}
        visible={this.state.loadingModalstate}
        backdropStyle={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      >
        <Image source={LoadingGif()} />
      </Modal>
    );

    const HeaderCalendar = (props) => (
      <Layout {...props}>
        <TouchableOpacity
          style={{
            alignSelf: "flex-end",
            marginTop: "1%",
            marginLeft: "3%",
          }}
          onPress={() => {
            this.setState({ visibleEditCalendar: false });
          }}
        >
          <EvilIcons name={"close"} size={30} color={"#5D738B"} />
        </TouchableOpacity>
        <Text category="h6">
          Select how many days to see in your session list by default
        </Text>
      </Layout>
    );

    const FooterCalendar = (props) => (
      <Layout {...props}>
        {this.state.changedCalendar ? (
          <View
            style={{
              flexDirection: "row",
              marginBottom: "5%",
              alignSelf: "center",
            }}
          >
            <Icon
              style={styles.icon}
              name="checkmark-circle-outline"
              fill="#4CBB17"
            />
            <Text
              style={{
                color: "#4CBB17",
                marginTop: "2%",
                marginLeft: "2%",
              }}
            >
              CALENDAR CHANGED!
            </Text>
          </View>
        ) : (
          <View style={{ marginBottom: "5%" }} />
        )}
      </Layout>
    );

    const ModalEditCalendar = () => (
      <Modal
        visible={this.state.visibleEditCalendar}
        onBackdropPress={() => this.setState({ visibleEditCalendar: false })}
        style={{ width: "95%" }}
        backdropStyle={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      >
        <Card disabled={true} header={HeaderCalendar} footer={FooterCalendar}>
          <Layout style={styles.container} level="1">
            <ButtonGroup status="basic" appearance="outline">
              <Button
                style={{
                  backgroundColor:
                    this.state.calendarOptionSelected === "T"
                      ? "#192f9e"
                      : "white",
                }}
                onPress={() => {
                  this.setState({
                    textCalendar: "Today sessions",
                  });
                  this.onPressEditCalendar("T", "Today sessions");
                }}
              >
                T
              </Button>
              <Button
                style={{
                  backgroundColor:
                    this.state.calendarOptionSelected === "W"
                      ? "#192f9e"
                      : "white",
                }}
                onPress={() => {
                  this.setState({
                    textCalendar: "This week sessions",
                  });
                  this.onPressEditCalendar("W", "This week sessions");
                }}
              >
                W
              </Button>
              <Button
                style={{
                  backgroundColor:
                    this.state.calendarOptionSelected === "M"
                      ? "#192f9e"
                      : "white",
                }}
                onPress={() => {
                  this.setState({
                    textCalendar: "This month sessions",
                  });
                  this.onPressEditCalendar("M", "This month sessions");
                }}
              >
                M
              </Button>
            </ButtonGroup>
            <Text style={styles.text}>{this.state.textCalendar}</Text>
          </Layout>
        </Card>
      </Modal>
    );

    const Header = (props) => (
      <Layout {...props}>
        <Image
          source={require("../assets/Icons/warning_Icon.png")}
          style={{
            height: 100,
            width: 100,
            resizeMode: "contain",
            alignSelf: "center",
          }}
        />
        <Text category="h6" style={{ alignSelf: "center" }}>
          Remove My Account
        </Text>
      </Layout>
    );

    const Footer = (props) => (
      <Layout {...props}>
        <Button
          appearance="ghost"
          status="danger"
          onPress={() => this.setState({ visible: false })}
        >
          CANCEL
        </Button>
        <Button
          style={{ marginTop: "0.5%" }}
          status="danger"
          onPress={() => this.deleteAccount()}
        >
          REMOVE MY ACCOUNT
        </Button>
      </Layout>
    );

    const ModalDeleteAccount = () => (
      <Modal
        visible={this.state.visible}
        onBackdropPress={() => this.setState({ visible: false })}
        style={{ width: "80%" }}
        backdropStyle={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      >
        <Card disabled={true} header={Header} footer={Footer}>
          <Text category="s1" style={{ textAlign: "justify" }}>
            By confirming, you are initiating REMOVAL OF YOUR PERSONAL
            INFORMATION and you will lose access to the Coach App. {"\n"}
            {"\n"}
            An email will be sent to your email address on record once removal
            is completed.
          </Text>
        </Card>
      </Modal>
    );
    return (
      <View style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View
            style={{
              backgroundColor: this.containerColor(),
              height: "58%",
              width: "95%",
              marginTop: "6%",
              marginBottom: "2.5%",
              borderRadius: 15,
              alignSelf: "center",
            }}
          >
            <Avatar
              size="xlarge"
              rounded
              ImageComponent={() =>
                this.state.image.length === 0 ? (
                  <Image
                    resizeMode="cover"
                    style={{
                      height: 145,
                      width: 145,
                      borderRadius: 15,
                      position: "absolute",
                    }}
                    source={getImage()}
                  />
                ) : (
                  <Image
                    resizeMode="cover"
                    style={{
                      height: 145,
                      width: 145,
                      borderRadius: 15,
                      position: "absolute",
                    }}
                    source={{ uri: this.state.image.assets[0].uri }}
                  />
                )
              }
              overlayContainerStyle={{
                justifyContent: "center",
                alignItems: "center",
                borderWidth: 2,
                borderColor: "white",
                borderStyle: "solid",
              }}
              activeOpacity={0.7}
              iconStyle={{ borderColor: "white", borderStyle: "solid" }}
              containerStyle={{
                borderColor: "white",
                borderStyle: "solid",
                alignSelf: "center",
                marginTop: "5%",
              }}
            />
            <Layout
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                alignSelf: "center",
                marginTop: "5%",
                backgroundColor: this.containerColor(),
              }}
            >
              <Button
                appearance="outline"
                accessoryRight={homeIcon}
                style={{ backgroundColor: "white" }}
                onPress={() =>
                  this.setState({ homeScreenvisibilityModal: true })
                }
              />
              <Button
                appearance="outline"
                accessoryRight={editIcon}
                style={{ backgroundColor: "white", marginLeft: "5%" }}
                onPress={() => this.setState({ coloroverlayvisibility: true })}
              />
              <Button
                appearance="outline"
                accessoryRight={calendaroutline}
                style={{ backgroundColor: "white", marginLeft: "5%" }}
                onPress={() => this.setState({ visibleEditCalendar: true })}
              />
            </Layout>
            <Button
              appearance="outline"
              style={{
                backgroundColor: "white",
                width: "55%",
                alignSelf: "center",
                marginTop: "4%",
              }}
              status="danger"
              onPress={() => this.setState({ visible: true })}
            >
              Remove My Account
            </Button>
          </View>
          {ModalDeleteAccount()}
          {ModalEditCalendar()}
          <Overlay
            isVisible={this.state.visibility}
            overlayStyle={styles.overlay}
            onBackdropPress={() => this.setState({ visibility: false })}
          >
            <TouchableOpacity onPress={openCamera}>
              <View style={{ flexDirection: "row" }}>
                <Icon
                  style={styles.icon}
                  fill="#8F9BB3"
                  name="camera-outline"
                />
                <Text style={styles.optionsTitle}>Take a picture</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={chooseImage}>
              <View style={{ flexDirection: "row" }}>
                <Icon style={styles.icon} fill="#8F9BB3" name="image-outline" />
                <Text style={styles.optionsTitle}>Upload an image</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.setState({ image: "" })}>
              <View style={{ flexDirection: "row" }}>
                <Icon
                  style={styles.icon}
                  fill="#8F9BB3"
                  name="trash-2-outline"
                />
                <Text style={styles.optionsTitle}>Delete image</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.setState({ visibility: false })}
            >
              <View style={{ flexDirection: "row" }}>
                <Icon
                  style={styles.icon}
                  fill="#8F9BB3"
                  name="close-square-outline"
                />
                <Text style={styles.optionsTitle}>Cancel</Text>
              </View>
            </TouchableOpacity>
          </Overlay>
          <Overlay
            isVisible={this.state.coloroverlayvisibility}
            overlayStyle={styles.overlayColors}
            onBackdropPress={() =>
              this.setState({ coloroverlayvisibility: false })
            }
          >
            <View style={{ alignSelf: "center" }}>
              <Carousel
                ref={this._carousel}
                data={paletteColors}
                renderItem={this._renderItem}
                sliderWidth={300}
                itemWidth={300}
                onSnapToItem={(index, item) =>
                  this.setState({ activeSlide: index })
                }
                //slideStyle={{alignSelf:'center'}}
                layout={"default"}
                //hasParallaxImages={true}
              />
              <View>
                {this.state.changedColor ? (
                  <View
                    style={{
                      flexDirection: "row",
                      marginTop: "4%",
                      alignSelf: "center",
                    }}
                  >
                    <Icon
                      style={styles.icon}
                      name="checkmark-circle-outline"
                      fill="#4CBB17"
                    />
                    <Text
                      style={{
                        color: "#4CBB17",
                        marginTop: "2%",
                        marginLeft: "2%",
                      }}
                    >
                      THEME CHANGED!
                    </Text>
                  </View>
                ) : (
                  <></>
                )}
                {this.state.selected === this.state.activeSlide ? (
                  <Button
                    appearance="ghost"
                    accessoryRight={checkboxActive}
                    style={{
                      backgroundColor: "white",
                      alignSelf: "center",
                    }}
                  />
                ) : (
                  <Button
                    appearance="ghost"
                    accessoryRight={checkboxPassive}
                    style={{
                      backgroundColor: "white",
                      alignSelf: "center",
                    }}
                    onPress={this.onPressChangeTheme}
                  />
                )}
              </View>
              {this.pagination}
            </View>
          </Overlay>
          <Overlay
            isVisible={this.state.homeScreenvisibilityModal}
            overlayStyle={styles.overlayHomeScreen}
            onBackdropPress={() => {
              this.setState({ homeScreenvisibilityModal: false }),
                this.props.navigation.navigate("My Profile");
            }}
          >
            <TouchableOpacity
              style={{
                alignSelf: "flex-end",
                marginTop: "1%",
                marginLeft: "3%",
              }}
              onPress={() => {
                this.setState({ homeScreenvisibilityModal: false }),
                  this.props.navigation.navigate("My Profile");
              }}
            >
              <EvilIcons name={"close"} size={30} color={"#5D738B"} />
            </TouchableOpacity>
            <View style={{ alignItems: "center" }}>
              <Text category="h5" style={{ marginTop: "10%" }}>
                Select your home screen:
              </Text>
              <View style={{ flexDirection: "row", marginTop: "15%" }}>
                {this.state.homeScreenOptions.map((value, index) => (
                  <View
                    style={
                      value.id === this.state.homeScreenOptionSelected
                        ? styles.selectedItem
                        : styles.optionView
                    }
                  >
                    <TouchableOpacity
                      onPress={() => this.onPressChangeHomeScreen(value)}
                    >
                      <Icon
                        name={value.icon}
                        fill="#8F9BB3"
                        style={{
                          width: 80,
                          height: 80,
                          alignSelf: "center",
                        }}
                      />
                      <Text category="h6">{value.title}</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
              <View>
                {this.state.changedHomeOption ? (
                  <View
                    style={{
                      flexDirection: "row",
                      marginTop: "4%",
                      alignSelf: "center",
                    }}
                  >
                    <Icon
                      style={styles.icon}
                      name="checkmark-circle-outline"
                      fill="#4CBB17"
                    />
                    <Text
                      style={{
                        color: "#4CBB17",
                        marginTop: "2%",
                        marginLeft: "2%",
                      }}
                    >
                      HOME SCREEN CHANGED!
                    </Text>
                  </View>
                ) : (
                  <></>
                )}
              </View>
            </View>
          </Overlay>
        </ScrollView>
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  sessions: state.sessions,
  user: state.user,
  sessionScreen: state.sessionScreen,
});

const ActionCreators = Object.assign({}, { logOutUser, changeRegion });

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(ActionCreators, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfileScreen);

const styles = StyleSheet.create({
  popOverContent: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    shadowRadius: 10,
    shadowOpacity: 0.12,
    shadowColor: "#000",
  },
  text: {
    marginHorizontal: 8,
    fontWeight: "bold",
    fontSize: 18,
    fontStyle: "italic",
  },
  image: {
    flex: 1,
    resizeMode: "contain",
    opacity: 0.99,
  },
  overlay: {
    width: "80%",
    height: "22%",
    alignSelf: "center",
  },
  overlayColors: {
    width: "90%",
    height: "90%",
    alignSelf: "center",
  },
  overlayHomeScreen: {
    width: "90%",
    height: "50%",
    alignSelf: "center",
  },
  optionsTitle: {
    marginTop: "2%",
    color: "#5D738B",
    marginLeft: "2%",
  },
  icon: {
    width: 28,
    height: 28,
    marginTop: 3,
  },
  imageContainer: {
    flex: 1,
    marginBottom: Platform.select({ ios: 0, android: 1 }), // Prevent a random Android rendering issue
    backgroundColor: "white",
    borderRadius: 8,
  },
  optionView: {
    height: "100%",
    width: "45%",
    alignItems: "center",
    borderColor: "#E0E0E0",
    borderWidth: 3,
    borderRadius: 5,
    marginLeft: "1.5%",
    marginRight: "1.5%",
    marginBottom: "1.5%",
    marginTop: "1%",
  },
  selectedItem: {
    height: "100%",
    width: "45%",
    alignItems: "center",
    borderColor: "#52a5cc",
    borderWidth: 3,
    borderRadius: 5,
    marginLeft: "1.5%",
    marginRight: "1.5%",
    marginBottom: "1.5%",
    marginTop: "1%",
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
});
