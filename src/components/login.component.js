import React, { Component } from 'react';
import { SafeAreaView } from 'react-native';
import { Button, Layout, Icon, Input, Text, Card } from '@ui-kitten/components';
import { View } from 'react-native';
import auth from '@react-native-firebase/auth';
import {ApiConfig} from "../config/ApiConfig";
import * as GoogleSignIn from 'expo-google-sign-in';
import moment from "moment";

import { useSelector, useDispatch } from 'react-redux';
import { loginUser, logOutUser, setPhoneAuthConfirmation } from "../Redux/actions/user.actions";
import { syncSessions } from "../Redux/actions/Session.actions";
import Axios from 'axios';

const useInputState = (initialValue = '') => {
    const [value, setValue] = React.useState(initialValue);
    return { value, onChangeText: setValue };
};  

const Header = (props) => (
    <View {...props}>
      <Text category='h6'>Log in</Text>
      <Text category='s1'>America Scores Attendance</Text>
    </View>
);

const PhoneIcon = (props) => ( <Icon {...props} name='phone-outline'/> );
const BackArrrowIcon = (props) => ( <Icon {...props} name='arrow-ios-back-outline'/> )

export const LogInScreen_PhoneAuth_Phone = ({navigation}) => {
  const dispatch = useDispatch();
  const loginPhoneNumber = useInputState("+54 358 602-2629");
  //Auth
  // Handle the button press
  async function loginWithPhoneNumber() {
    try {
      const confirmation = await auth().signInWithPhoneNumber(loginPhoneNumber.value).catch(e =>console.log(e));
      dispatch(setPhoneAuthConfirmation(confirmation));
      if (confirmation) navigation.navigate("PhoneLogin_code");
      else console.log("SMS Was not sent")
    } catch(error) {console.log(error)}
  }

  return(
    <Layout style={{flex: 1}} level="4">
      <SafeAreaView forceInset={{ top: 'always', bottom: 'never' }} style={{ flex: 1 }}>
        <Layout style={{flex: 1, justifyContent: "center", alignItems: 'center'}} level="4">
          <Layout style={{padding: '5%', width:'100%', height:'100%'}} level="4">
            <Card style={{flex: 1}} status="primary" header={Header}>
              <Text style={{paddingBottom: "5%"}}>We will send verification SMS code to the following phone number.</Text>
              <Input
                // style={styles.input}
                status='primary'
                label='Phone number'
                placeholder='+1 646 660 0404' //America scores phone
                {...loginPhoneNumber}
              />
            </Card>                
            <Layout style={{ justifyContent: 'center', alignItems: 'center' }}>
            <Button style={{width:'100%'}} accessoryLeft={BackArrrowIcon} appearance="ghost" status="basic" onPress={() => navigation.goBack()}>GO BACK</Button>
            <Button style={{width:'100%'}} accessoryLeft={PhoneIcon} status="primary" onPress={() => loginWithPhoneNumber(navigation)}>SIGN IN WITH PHONE</Button>
            </Layout>            
          </Layout>   
        </Layout>
      </SafeAreaView>
    </Layout>
  );
};

export const LogInScreen_PhoneAuth_Code = ({navigation}) => {
  const state = useSelector(state => state.user)
  const dispatch = useDispatch();
  const loginCode = useInputState();

  async function _setupUser(userIdentifier, serviceProvider) {
    await Axios.get(`${ApiConfig.baseUrl}/auth/login`, {
      params: {
        useridentifier: "415-815-7825",
        serviceprovider: serviceProvider
      }
      }).then(res => {
        const userProfile = res.data;
        if (userProfile.ContactId) {
          _syncUserSessions(userProfile)
            .then(userSessions => {
              dispatch(loginUser(userProfile));
              dispatch(syncSessions(userSessions));
              navigation.navigate("HomeRoot");
            }).catch(error => {console.log(error); _rollbackSetupUser()});
        } else {
          console.log("This user does not exist in salesforce");
          _rollbackSetupUser()
        };
      }).catch(error => console.log(error));
  }

  async function confirmCode() {
    try {
      const res = await state.confirmation.confirm(loginCode.value);
      let newPhoneNumber = res.user.phoneNumber;
      newPhoneNumber = newPhoneNumber.replace('+1', '');
      _setupUser(newPhoneNumber, "Phone")
    } catch (error) {
      console.log(error)
      console.log('Invalid code.');
    }
  }

  const _rollbackSetupUser = async () => {
    await GoogleSignIn.signOutAsync();
    dispatch(logOutUser());
  }

  return(
    <Layout style={{flex: 1}} level="4">
      <SafeAreaView forceInset={{ top: 'always', bottom: 'never' }} style={{ flex: 1}}>
        <Layout style={{flex: 1, justifyContent: "center", alignItems: 'center'}} level="4">
          <Layout style={{padding: '5%', width:'100%', height:'100%'}} level="4">
            <Card style={{flex: 1}} status="primary" header={Header}>
              <Text style={{paddingBottom: "5%"}}>Insert the received code</Text>
              <Input
                // style={styles.input}
                status='primary'
                label='Code'
                placeholder='123456' //America scores phone
                {...loginCode}              
                />
            </Card>                
            <Layout style={{ justifyContent: 'center', alignItems: 'center' }}>
              <Button style={{width:'100%'}} accessoryLeft={BackArrrowIcon} appearance="ghost" status="basic" onPress={() => navigation.goBack()}>GO BACK</Button>
              <Button style={{width:'100%'}} accessoryLeft={PhoneIcon} status="primary" onPress={() => confirmCode()}>CONTINUE</Button>
            </Layout>            
          </Layout>   
        </Layout>
      </SafeAreaView>
    </Layout>
  );
};

const _syncUserSessions = async (user) => {
  Axios.get(`${ApiConfig.dataApi}/${user.ContactId}/all`, {
      params: {
        date: moment("2019-08-21").format("YYYY-MM-DD")
      }
    })
    .then(res => res.data)
    .catch(e => console.log(e));
}

export const _fetchUserProfile = async (userIdentifier, serviceProvider) => {
  Axios.get(`${ApiConfig.baseUrl}/auth/login`, {
      params: {
        useridentifier: userIdentifier,
        serviceprovider: serviceProvider
      }
  })
  .then(res => res.data)
  .catch(e => console.log(e));
}

//style={styles.card} header={Header} footer={Footer}
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });