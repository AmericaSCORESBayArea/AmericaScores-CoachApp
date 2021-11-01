import React, {useRef} from 'react';
import { Modal, Card, Text, Button, Layout } from '@ui-kitten/components';
import { ScrollView, View, Dimensions, Image } from 'react-native';
import { WebView } from 'react-native-webview';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ApiConfig } from '../config/ApiConfig';
import Carousel, { Pagination } from 'react-native-snap-carousel';
export const userGuideModal = ({ navigation }) => {

    const [visible, setVisible] = React.useState(true);
    const [slider1ActiveSlide, setSlider1ActiveSlide] = React.useState(0);
    const carouselRef = useRef(null);    
    function closeModal() {
        fetchMyAsyncStorage()
        setVisible(false);
        navigation.goBack();
    }
    async function fetchMyAsyncStorage() {
        let aux = await AsyncStorage.getItem('userFirstTime')
        if(aux === null){
            await AsyncStorage.setItem('userFirstTime', 'true');
        }
    }
    const Footer = (props) => (
        <Layout {...props}>
            <Button onPress={() => closeModal()}>
                Close
            </Button>
        </Layout>
    );

    const Header = (props) => (
        <Layout {...props}>
            <View style={{ flexDirection: 'row' }}>
                <Text category='s1'>Welcome to</Text><Text category='s1' style={{ color: '#C1666B' }}> America</Text><Text category='s1' style={{ color: '#1C5D99' }}> SCORES Bay Area</Text><Text category='s1'> app.</Text>
            </View>
        </Layout>
    );

    const renderItems = ({ item }) => (
        <View >
           <WebView
            style={{ height: 350, flex: 1,  marginTop: 20}}
            allowsFullscreenVideo={true}
            source={{ uri: item }}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            userAgent="Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.71 Safari/537.36"
            />
            <View style={{flexDirection:'row'}}>
                <Image source={require('./../../assets/SwipeLeft.png')} style={{height:80, width: 80, resizeMode:'contain',}}/>
                <Image source={require('./../../assets/SwipeRight.png')} style={{height:80, width: 80, resizeMode:'contain', marginLeft:'50%', marginRight:'auto'}}/>
            </View>
        </View>
    );

    return (
        <React.Fragment>
            <Modal
                visible={visible}
                onBackdropPress={() => closeModal()}
                style={{ width: '95%', height: '100%', marginTop: '7%'}}>
                <ScrollView>
                    <Card disabled={true} style={{ marginTop: '6%', height: '100%', width: '100%', marginBottom: '10%' }} header={Header} footer={Footer}>
                        <ScrollView>
                            <Carousel
                                activeSlideAlignment='center'
                                ref={carouselRef}//nuevo
                                inactiveSlideOpacity={0.3}
                                inactiveSlideScale={1}
                                sliderWidth={Dimensions.get('window').width - 55}
                                itemWidth={Dimensions.get('window').width - 55}
                                data={ApiConfig.youtubeUrl}
                                renderItem={renderItems}
                                containerCustomStyle={{ overflow: 'visible' }}
                                contentContainerCustomStyle={{ overflow: 'visible' }}
                                layout={'default'}
                                //loopClonesPerSide={5}
                                onSnapToItem={(index) => setSlider1ActiveSlide(index)}
                            />
                            <Pagination
                                dotsLength={(ApiConfig.youtubeUrl).length}
                                activeDotIndex={slider1ActiveSlide}
                                carouselRef={carouselRef}
                                tappableDots={!!carouselRef}
                                dotStyle={{
                                    width: 10,
                                    height: 10,
                                    borderRadius: 5,
                                    marginHorizontal: 8,
                                    backgroundColor: 'rgba(0, 0, 0, 0.75)'
                                }}
                                inactiveDotStyle={{
                                    backgroundColor: 'rgba(0, 0, 0, 0.75)'
                                }}
                                inactiveDotOpacity={0.4}
                                inactiveDotScale={0.6}
                            />
                        </ScrollView>
                    </Card>
                </ScrollView>
            </Modal>
        </React.Fragment>
    );
}
export const userGuideModalLogin = ({ navigation }) => {

    const [visible, setVisible] = React.useState(true);

    function closeModal() {
        fetchMyAsyncStorage()
        setVisible(false);
        navigation.goBack();
    }
    async function fetchMyAsyncStorage() {
        let aux = await AsyncStorage.getItem('userFirstTime')
        if(aux === null){
            await AsyncStorage.setItem('userFirstTime', 'true');
        }
    }
    const Footer = (props) => (
        <Layout {...props}>
            <Button onPress={() => closeModal()}>
                Close
            </Button>
        </Layout>
    );

    const Header = (props) => (
        <Layout {...props}>
            <View style={{ flexDirection: 'row' }}>
                <Text category='s1'>Welcome to</Text>
                <Text category='s1' style={{ color: '#C1666B' }}> America</Text>
                <Text category='s1' style={{ color: '#1C5D99' }}> SCORES Bay Area</Text>
                <Text category='s1'> app.</Text>
            </View>
        </Layout>
    );
    return (
        <React.Fragment>
            <Modal
                visible={visible}
                onBackdropPress={() => closeModal()}
                style={{ width: '95%', height: '100%', marginTop: '7%' }}>
                <ScrollView>
                    <Card disabled={true} status="primary" style={{ marginTop: '6%', height: '100%', width: '100%'}} header={Header} footer={Footer}>
                        <ScrollView>
                            <WebView
                                style={{ height: 400, flex: 1,  marginTop: 20}}
                                allowsFullscreenVideo={true}
                                source={{ uri: ApiConfig.youtubeUrl[0]}}
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
}