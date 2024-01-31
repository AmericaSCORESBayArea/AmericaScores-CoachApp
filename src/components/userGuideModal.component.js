import React, { useRef, useEffect } from "react";
import { Modal, Card, Text, Button, Layout } from "@ui-kitten/components";
import { ScrollView, View, Dimensions, Image } from "react-native";
import { WebView } from "react-native-webview";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ApiConfig } from "../config/ApiConfig";
import Carousel, { Pagination } from "react-native-snap-carousel";
import analytics from "@react-native-firebase/analytics";
import { useSelector } from "react-redux";

export const userGuideModal = ({ navigation }) => {
  const user = useSelector((state) => state.user.user);
  useEffect(async () => {
    getYoutubeVideos();
    await analytics().logEvent("userGuide", {
      coach_Id: user.ContactId,
      application: "Coach App"
    });
  }, []);
  const [visible, setVisible] = React.useState(true);
  const [slider1ActiveSlide, setSlider1ActiveSlide] = React.useState(0);
  const carouselRef = useRef(null);
  const [videoData, setVideoData] = React.useState([]);
  async function getYoutubeVideos() {
    const res = await fetch(
      `${ApiConfig.youtubeApi}&key=${ApiConfig.youtubeSecretKey}`
    );
    const data = await res.json();
    setVideoData(data);
  }
  function closeModal() {
    fetchMyAsyncStorage();
    setVisible(false);
    navigation.goBack();
  }
  async function fetchMyAsyncStorage() {
    let aux = await AsyncStorage.getItem("userFirstTime");
    if (aux === null) {
      await AsyncStorage.setItem("userFirstTime", "true");
    }
  }
  const Footer = (props) => (
    <Layout {...props}>
      <Button onPress={() => closeModal()}>Close</Button>
    </Layout>
  );

  const Header = (props) => (
    <Layout {...props}>
      <View style={{ flexDirection: "row" }}>
        <Text category="p2">Welcome to</Text>
        <Text category="p2" style={{ color: "#C1666B" }}>
          {" "}
          America
        </Text>
        <Text category="p2" style={{ color: "#1C5D99" }}>
          {" "}
          SCORES Bay Area
        </Text>
        <Text category="p2"> app.</Text>
      </View>
    </Layout>
  );
  const renderItems = ({ item }) => (
    <View>
      <WebView
        style={{
          height: 350,
          flex: 1,
          marginTop: 10,
          width: Dimensions.get("window").width - 55,
        }}
        allowsFullscreenVideo={true}
        source={{
          uri: `https://youtube.com/embed/${item.snippet.resourceId.videoId}`,
        }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        userAgent="Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.71 Safari/537.36"
      />
      <View style={{ flexDirection: "row" }}>
        <Image
          source={require("./../../assets/SwipeLeft.png")}
          style={{ height: 70, width: 42, resizeMode: "contain" }}
        />
        <Text
          style={{
            width: "60%",
            alignSelf: "center",
            textAlign: "justify",
            marginLeft: "1%",
            marginTop: "3%",
          }}
        >
          {item.snippet.description}
        </Text>
        <Image
          source={require("./../../assets/SwipeRight.png")}
          style={{
            height: 70,
            width: 42,
            resizeMode: "contain",
            marginRight: "auto",
          }}
        />
      </View>
    </View>
  );

  return (
    <React.Fragment>
      <Modal
        visible={visible}
        onBackdropPress={() => closeModal()}
        style={{ width: "95%", height: "100%", marginTop: "7%" }}
      >
        <ScrollView>
          <Card
            disabled={true}
            style={{
              marginTop: "6%",
              height: "100%",
              width: "100%",
              marginBottom: "10%",
            }}
            header={Header}
            footer={Footer}
          >
            <ScrollView>
              {videoData.length !== 0 ? (
                <React.Fragment>
                  <Carousel
                    activeSlideAlignment="center"
                    ref={carouselRef} //nuevo
                    inactiveSlideScale={0.94}
                    inactiveSlideOpacity={0.6}
                    showsHorizontalScrollIndicator={false}
                    snapOnAndroid={true}
                    removeClippedSubviews={false}
                    sliderWidth={Dimensions.get("window").width}
                    itemWidth={Dimensions.get("window").width}
                    data={videoData.items}
                    renderItem={renderItems}
                    containerCustomStyle={{ overflow: "visible" }}
                    contentContainerCustomStyle={{ overflow: "visible" }}
                    layout={"default"}
                    //loopClonesPerSide={5}
                    onSnapToItem={(index) => setSlider1ActiveSlide(index)}
                  />
                  <Pagination
                    dotsLength={videoData.items.length}
                    activeDotIndex={slider1ActiveSlide}
                    carouselRef={carouselRef}
                    tappableDots={!!carouselRef}
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
                </React.Fragment>
              ) : (
                <></>
              )}
            </ScrollView>
          </Card>
        </ScrollView>
      </Modal>
    </React.Fragment>
  );
};
export const userGuideModalLogin = ({ navigation }) => {
  useEffect(() => {
    getYoutubeVideos();
  }, []);
  const [visible, setVisible] = React.useState(true);
  const [videoData, setVideoData] = React.useState([]);
  async function getYoutubeVideos() {
    const res = await fetch(
      `${ApiConfig.youtubeApi}&key=${ApiConfig.youtubeSecretKey}`
    );
    const data = await res.json();
    setVideoData(data.items[0].snippet.resourceId.videoId);
  }

  function closeModal() {
    fetchMyAsyncStorage();
    setVisible(false);
    navigation.goBack();
  }
  async function fetchMyAsyncStorage() {
    let aux = await AsyncStorage.getItem("userFirstTime");
    if (aux === null) {
      await AsyncStorage.setItem("userFirstTime", "true");
    }
  }
  const Footer = (props) => (
    <Layout {...props}>
      <Button onPress={() => closeModal()}>Close</Button>
    </Layout>
  );

  const Header = (props) => (
    <Layout {...props}>
      <View style={{ flexDirection: "row", width: "90%" }}>
        <Text category="p2">Welcome to</Text>
        <Text category="p2" style={{ color: "#C1666B" }}>
          {" "}
          America
        </Text>
        <Text category="p2" style={{ color: "#1C5D99" }}>
          {" "}
          SCORES Bay Area
        </Text>
        <Text category="p2"> app.</Text>
      </View>
    </Layout>
  );
  return (
    <React.Fragment>
      <Modal
        visible={visible}
        onBackdropPress={() => closeModal()}
        style={{ width: "95%", height: "100%", marginTop: "7%" }}
      >
        <ScrollView>
          <Card
            disabled={true}
            status="primary"
            style={{ marginTop: "6%", height: "100%", width: "100%" }}
            header={Header}
            footer={Footer}
          >
            <ScrollView>
              <WebView
                style={{ height: 400, flex: 1, marginTop: 20 }}
                allowsFullscreenVideo={true}
                source={{ uri: `https://youtube.com/embed/${videoData}` }}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                userAgent="Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.71 Safari/537.36"
              />
            </ScrollView>
          </Card>
        </ScrollView>
      </Modal>
    </React.Fragment>
  );
};
