import React, { useEffect } from 'react';
import { SafeAreaView, ImageBackground, FlatList, ScrollView, Linking, Platform } from 'react-native';
import { Layout, Text, Card, Modal, Button } from '@ui-kitten/components';
import { View} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { changeRegion, changeRegionList, changeUpdateApp } from "../Redux/actions/SessionScreen.actions";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { paletteColors } from './paletteColors';
import checkVersion from 'react-native-store-version';
import DeviceInfo from 'react-native-device-info';
const Clubs = [
  {
      id:0,
      title:"ASBA",
      image:require('../../assets/ASBA_Logo_Only_Removedbg.png'),
  },
  {
      id:1,
      title:"IFC",
      image:require('../../assets/IFC-Logo.png'),
  },
  {
      id:2,
      title:"OGSC",
      image:require('../../assets/Genesis_Logo.png'),
  },
];
const Header = (props) => (
    <View style={{marginTop:"20%", marginBottom:"5%", alignSelf:"center"}}>
      <Text category='h2' style={{color:"#535353"}}>Select an affiliation</Text>
    </View>
  );
const Headerr = (props) => (
    <View >
       <ImageBackground
          resizeMode="contain"
          key={props}
          style={{height:100, width:100, margin:"20%", alignSelf:"center"}}
          source={props}
        />
    </View>
  );
  export const LogInScreen_Select_Club = ({navigation}) => {
    const [updatedModal, setUpdatedModal] = React.useState(false);
    const dispatch = useDispatch();
    const state = useSelector(state => state.sessionScreen.updateapp)
    useEffect(() => {
      async function fetchMyAsyncStorage() {
        let aux = await AsyncStorage.getItem('userFirstTime')
        if(!aux){
          navigation.navigate("userGuideModalLogin");
        }
      }
      fetchMyAsyncStorage()
      const init = async () => {
        try{
          const check = await checkVersion({
            version: DeviceInfo.getVersion(), // app local version
            iosStoreURL: 'https://apps.apple.com/bo/app/america-scores-attendance/id1527435979',
            androidStoreURL: 'https://play.google.com/store/apps/details?id=com.americaScoresAttendance.app&hl=es_419&gl=US',
          });
          if(check.result === "new" && state !== true){
            setUpdatedModal(true);
            dispatch(changeUpdateApp(true));
          }
        } catch(e) {
          console.log(e);
        }
      };
      init();
    }, [])
    function toggleNotificationOff() {
      setUpdatedModal(false);
    }
    function toggleNotificationOffUpdate() {
      setUpdatedModal(false);
      if(Platform.OS === 'android'){
        Linking.openURL('https://play.google.com/store/apps/details?id=com.americaScoresAttendance.app&hl=es_419&gl=US');
      }else if(Platform.OS === 'ios'){
        Linking.openURL('https://apps.apple.com/bo/app/america-scores-attendance/id1527435979');
      }
    }
    async function clubSelected(region) {
        dispatch(changeRegion(region));
        if(region === 'ASBA'){
          dispatch(changeRegionList(['All ASBA','San Francisco','San Jose','San Rafael','Oakland','Daly City','Hayward','Redwood City',
          'San Francisco Civic Center','San Francisco Crocker','Alameda','Marin','San Mateo','Unrestricted']));
        }else if(region === 'IFC'){
          dispatch(changeRegionList(['All IFC', 'IFC-SF']));
        }else if(region === 'OGSC'){
          dispatch(changeRegionList(['All OGSC', 'Genesis']));
        }
        const aux = await AsyncStorage.getItem('customTheme')
        if(aux === null){
            await AsyncStorage.setItem('customTheme',JSON.stringify(paletteColors[0]));
        }
    }
    const renderItems = ({ item }) => (
      <Card style={{margin:"2%", width:"47%"}} status="primary" key={item.title} header={() => Headerr(item.image)} onPress={() => clubSelected(item.title)}>
        <Text category='h6' key={item.title} style={{ alignSelf:"center"}}>
            {item.title}
        </Text>            
      </Card> 
    );
    const SuccessHeader = (props) => (
      <Layout {...props}>
           <ImageBackground
              resizeMode="contain"
              style={{height:150, width:150, alignSelf:"center"}}
              source={require('../../assets/update_icon.png')}
          />
          <Text category='h6' appearance='hint' status='info' style={{alignSelf:'center', marginTop:'2%'}}>New update is available</Text>
      </Layout>
  );
  const updateSuccessCard = (status, text) => (
    <Card disabled={true} header={SuccessHeader}>
        <Text style={{margin: 15}} status={status}>{text}</Text> 
        <Button appearance='filled' size={'small'} style={{marginBottom:'3%'}} onPress={() => {toggleNotificationOffUpdate()}} status={status}>
              UPDATE
        </Button>
        <Button appearance='outline' size={'small'} onPress={() => {toggleNotificationOff()}} status={status}>
              NOT NOW
        </Button>
    </Card>
  );
    const updateModal = () => (
      <Modal
          visible={updatedModal}
          style={{
          width:'100%',
          flexDirection: 'row',
          alignItems: 'center',
          alignSelf:'center',
          padding: '7%',
          shadowRadius: 10,
          shadowOpacity: 0.12,
          shadowColor: "#000"}}
          backdropStyle={{backgroundColor: 'rgba(0, 0, 0, 0.5)'}}
          onBackdropPress={() => toggleNotificationOff()}>
          {
              updateSuccessCard("info", "America SCORES Bay Area requests that you update to the latest version.")
          }
      </Modal>)

    return(
    <Layout style={{flex: 1}} level="4">
      <ScrollView bounces={false}>
        <SafeAreaView forceInset={{ top: 'always', bottom: 'never' }} style={{ flex: 1 }} >
          <Layout style={{flex: 1, justifyContent: "center", alignItems: 'center'}} level="4">
            <Layout style={{padding: '2%', width:'100%', height:'100%'}} level="4">
              <Card style={{flex: 1, backgroundColor:"#F4F2F2", minHeight:'110%'}} status="primary" header={Header}>
              <Layout style={{ justifyContent: 'center', alignItems: 'center', marginTop:"2%", backgroundColor:"#F4F2F2"}}>
                {updateModal()}
                <FlatList
                  data={Clubs}
                  renderItem={renderItems}
                  keyExtractor={item => item.id}
                  numColumns={2}
                />   
              </Layout>
              </Card>                   
            </Layout>   
          </Layout>
        </SafeAreaView>
      </ScrollView>   
    </Layout>
    );
  };