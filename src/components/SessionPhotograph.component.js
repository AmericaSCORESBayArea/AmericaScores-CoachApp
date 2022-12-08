import React from "react";
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
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import {
  Layout,
  Button,
  Icon,
  Text,
  Modal,
  Card,
  Spinner,
} from "@ui-kitten/components";
import { Root, Popup } from "popup-ui";
import { ApiConfig } from "../config/ApiConfig";
export default class SessionPhotograph extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visibility: true,
      image: "",
    };
  }

  async componentDidMount() {
    const { route } = this.props;
    console.log(route.params);
    //await this.setState({ enrollments: route.params.enrollments });
  }

  toggleModalOff() {
    this.setState({ visibility: false });
  }

  render() {
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
          this.setState({ visibility: true });
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
    const asyncCall = async () => {
      const data = new FormData();
      const uri = this.state.image.assets[0].uri;
      const type = this.state.image.assets[0].type;
      const name = this.state.image.assets[0].fileName;
      const source = {
        uri,
        type,
        name,
      };
      data.append("file", source);
      data.append("upload_preset", ApiConfig.cloudName);
      data.append("cloud_name", ApiConfig.cloudName);
      fetch(ApiConfig.cloudinaryURL, {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data.secure_url);
          uploadImageSalesforce();
        })
        .catch((err) => {
          console.log(err);
          setSubmit(false);
          Alert.alert(
            "Oops",
            "An Error occured while uploading the Image. Please try again."
          );
        });
    };
    const uploadImageSalesforce = () => {
      this.setState({ visibility: false });
      Popup.show({
        type: "Success",
        title: "Photograph uploaded!",
        button: true,
        textBody: "The photograph was uploaded successfully.",
        buttonText: "Ok",
        callback: () => {
          Popup.hide();
          this.props.navigation.goBack();
        },
      });
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
          this.setState({ visibility: true });
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

    return (
      <Root>
        <Layout style={{ flex: 1 }}>
          <Overlay
            isVisible={this.state.visibility}
            overlayStyle={
              this.state.image.length === 0
                ? styles.overlay
                : styles.overlayImage
            }
            onBackdropPress={() => this.setState({ visibility: false })}
          >
            {this.state.image.length === 0 ? (
              <React.Fragment>
                <Text style={styles.optionsTitleOverlay}>Select an option</Text>
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
                    <Icon
                      style={styles.icon}
                      fill="#8F9BB3"
                      name="image-outline"
                    />
                    <Text style={styles.optionsTitle}>Upload an image</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({ visibility: false });
                    this.props.navigation.goBack();
                  }}
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
              </React.Fragment>
            ) : (
              <React.Fragment>
                <Image
                  resizeMode="cover"
                  style={{
                    alignSelf: "center",
                    height: 145,
                    width: 165,
                    borderRadius: 5,
                  }}
                  source={{ uri: this.state.image.assets[0].uri }}
                />
                <Text style={styles.optionsSubTitle}>
                  The next photograph will be uploaded to Salesforce along with
                  information from the current session.
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    width: "100%",
                    marginTop: "4%",
                  }}
                >
                  <TouchableOpacity onPress={asyncCall}>
                    <View style={{ flexDirection: "row" }}>
                      <Icon
                        style={styles.icon}
                        fill="#8F9BB3"
                        name="cloud-upload-outline"
                      />
                      <Text style={styles.optionsTitle}>Upload Photograph</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => this.setState({ image: "" })}
                  >
                    <View style={{ flexDirection: "row" }}>
                      <Icon
                        style={styles.icon}
                        fill="#8F9BB3"
                        name="backspace-outline"
                      />
                      <Text style={styles.optionsTitleBack}>Go back</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </React.Fragment>
            )}
          </Overlay>
        </Layout>
      </Root>
    );
  }
}
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
    height: "18%",
    alignSelf: "center",
  },
  overlayImage: {
    width: "80%",
    height: "38%",
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
  optionsTitleOverlay: {
    marginTop: "0.5%",
    color: "#5D738B",
    alignSelf: "center",
    fontStyle: "italic",
    fontSize: 18,
  },
  optionsSubTitle: {
    marginTop: "2%",
    color: "#5D738B",
    marginLeft: "2%",
    fontStyle: "italic",
  },
  optionsTitleBack: {
    marginTop: "6%",
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
