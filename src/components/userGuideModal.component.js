import React from 'react';
import { Modal, Card, Text, Button, Layout } from '@ui-kitten/components';
import { ScrollView, View } from 'react-native';
import { WebView } from 'react-native-webview';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ApiConfig } from '../config/ApiConfig';
export const userGuideModal = ({ navigation }) => {

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
                <Text category='s1'>Welcome to</Text><Text category='s1' style={{ color: '#C1666B' }}> America</Text><Text category='s1' style={{ color: '#1C5D99' }}> SCORES Bay Area</Text><Text category='s1'> app.</Text>
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
                    <Card disabled={true} style={{ marginTop: '6%', height: '100%', width: '100%' }} header={Header} footer={Footer}>
                        <ScrollView>
                            <WebView
                                style={{ height: 350, flex: 1,  marginTop: 20}}
                                allowsFullscreenVideo={true}
                                source={{ uri: ApiConfig.youtubeUrl }}
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
                                source={{ uri: ApiConfig.youtubeUrl }}
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