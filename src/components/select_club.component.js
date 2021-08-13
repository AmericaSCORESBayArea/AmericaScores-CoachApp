import React from 'react';
import { SafeAreaView, ImageBackground, FlatList} from 'react-native';
import { Layout, Text, Card } from '@ui-kitten/components';
import { View} from 'react-native';
import { useDispatch } from 'react-redux';
import { changeRegion, changeRegionList } from "../Redux/actions/SessionScreen.actions";
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
    const dispatch = useDispatch();
    async function clubSelected(region) {
        dispatch(changeRegion(region));
        if(region === 'ASBA'){
          dispatch(changeRegionList(['All','Other','San Francisco','San Jose','San Rafael','Oakland','Daly City','Hayward','Redwood City',
          'San Francisco Civic Center','San Francisco Crocker','Alameda','Marin','San Mateo','Unrestricted']));
        }else if(region === 'IFC'){
          dispatch(changeRegionList(['All', 'IFC-SF']));
        }else if(region === 'OGSC'){
          dispatch(changeRegionList(['All', 'Genesis']));
        }
    }
    const renderItems = ({ item }) => (
      <Card style={{margin:"2%", width:"47%"}} status="primary" key={item.title} header={() => Headerr(item.image)} onPress={() => clubSelected(item.title)}>
        <Text category='h6' key={item.title} style={{ alignSelf:"center"}}>
            {item.title}
        </Text>            
      </Card> 
    );
    return(
    <Layout style={{flex: 1}} level="4">
      <SafeAreaView forceInset={{ top: 'always', bottom: 'never' }} style={{ flex: 1 }} >
        <Layout style={{flex: 1, justifyContent: "center", alignItems: 'center'}} level="4">
          <Layout style={{padding: '2%', width:'100%', height:'100%'}} level="4">
            <Card style={{flex: 1, backgroundColor:"#F4F2F2"}} status="primary" header={Header}>
            <Layout style={{ justifyContent: 'center', alignItems: 'center', marginTop:"2%", backgroundColor:"#F4F2F2"}}>
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
    </Layout>
    );
  };