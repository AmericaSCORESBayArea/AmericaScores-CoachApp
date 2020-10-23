import React, { Component, useEffect } from 'react';
import { Alert, Image, ImageBackground, SafeAreaView } from 'react-native';
import { Button, Layout, Text, Icon } from '@ui-kitten/components';
import { StyleSheet, View } from 'react-native';
import Axios from "axios";
import {ApiConfig} from "../config/ApiConfig";

import moment from "moment";

import * as GoogleSignIn from 'expo-google-sign-in';
import auth from '@react-native-firebase/auth';
import appleAuth, {
  AppleButton,
  AppleAuthRequestScope,
  AppleAuthRequestOperation,
} from '@invertase/react-native-apple-authentication';

import { connect } from 'react-redux';
import { loginUser, logOutUser } from '../Redux/actions/user.actions';
import { syncSessions } from '../Redux/actions/Session.actions';
import { bindActionCreators } from 'redux';

class LogInScreen_Google extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
      this.initAsync();
    }

    initAsync = async () => {
        await GoogleSignIn.initAsync({clientId: '688897090799-99bi882h4pkc3vkksl71mm387lgvd2lp.apps.googleusercontent.com'});
    };

    _syncUserWithStateAsync = async () => {
        const loggedUser = await GoogleSignIn.signInSilentlyAsync();
        if (loggedUser !== null) this._setupUser(loggedUser.email,"google");
    };

    _setupUser = async (userIdentifier, serviceProvider) => {
      const {actions, navigation} = this.props;

      Axios.get(`${ApiConfig.baseUrl}/auth/login`, {
        params: {
          useridentifier: userIdentifier,
          serviceprovider: serviceProvider
        }})
      .then(response => {
        const userProfile = response.data;
        if (userProfile.ContactId) {
          console.log(userProfile);
          this._syncUserSessions(userProfile)
            .then(userSessions => {
              console.log(userSessions);
              actions.loginUser(userProfile);
              actions.syncSessions(userSessions);
              navigation.navigate("HomeRoot");
            }).catch(error => {console.log(error); this._rollbackSetupUser()});
        } else {
          Alert.alert("Not an America Scores account","This account appearenlty does not exist, please contact your Salesforce administrator.");
          return _rollbackSetupUser()
        };
      }).catch(error => Alert.alert("Login Error", "User not found, please contact your company admin."))
    }

    _rollbackSetupUser = async () => {
      const {actions} = this.props;
      await GoogleSignIn.signOutAsync();
      actions.logOutUser();
    }

    signInAsync = async () => {
        try {
          await GoogleSignIn.askForPlayServicesAsync();
          const { type, user } = await GoogleSignIn.signInAsync();
          if (type === 'success') this._syncUserWithStateAsync();
        } catch ({ message }) { alert('login: Error:' + message); }
    };

    signInGoogle = () => {
      if (this.props.user.logged) {
        this._rollbackSetupUser();
      } else {
        this.signInAsync();
      }
    };

    signInApple = async () => {
      console.log("[APPLE LOGIN | Start]");
      try {
        const appleAuthRequestResponse = await appleAuth.performRequest({
          requestedOperation: AppleAuthRequestOperation.LOGIN,
          requestedScopes: [AppleAuthRequestScope.EMAIL, AppleAuthRequestScope.FULL_NAME],
        });
        // Ensure Apple returned a user identityToken
        if (!appleAuthRequestResponse.identityToken) Alert.alert("Log in error",`Apple log in failed, try another method or try later.`);

        if (!appleAuthRequestResponse.email) Alert.alert("Log in error",`We need your email to log you in. Do NOT press "Hide email" please.`);
        console.log("[APPLE LOGIN] Successful request");
        // Create a Firebase credential from the response
        const { identityToken, nonce } = appleAuthRequestResponse;
        const appleCredential = auth.AppleAuthProvider.credential(identityToken, nonce);
  
        if (!appleCredential) {
          Alert.alert("Log in error",`Apple log in failed, try another method or try later.`);
          throw "[APPLE LOGIN | ERROR] in appleCredential"; 
        } else console.log("[APPLE LOGIN] got appleCredential ");

        // Sign the user in with the credential
        const response = auth().signInWithCredential(appleCredential);
        if (!response) {
          Alert.alert("Log in error",`Apple log in failed, try another method or try later.`);
          throw "[APPLE LOGIN | ERROR] in signInWithCredentials" 
        } else console.log("[APPLE LOGIN] signed In with credentials");
        
        //TODO Change the gmail for email in backend
        this._setupUser(appleAuthRequestResponse.email,"email");
      } catch (error) {
        Alert.alert("Log in error",`Apple log in failed, try another method or try later.`);
        console.log("[APPLE LOGIN ERROR]", error);
      }
    }

    async _syncUserSessions(user) {
      Axios.get(`${ApiConfig.dataApi}/coach/${user.ContactId}/all`, {
          params: {
            date: moment()
          }
        })
        .then(res => res.data)
        .catch(e => console.log(e));
    }   

    render() {
        const {navigation} = this.props;
        const Header = (props) => (
            <View {...props} style={{margin: "3%"}}>
              <Text category='h6'>Log in</Text>
              <Text category='s1'>America Scores Attendance APP</Text>
            </View>
        );
        const PhoneIcon = (props) => ( <Icon {...props} name='phone'/> );
        const GoogleIcon = (props) => ( <Icon {...props} name='google'/> );
        const AppleIcon = (props) => ( <Icon {...props} name='external-link'/> )
        const BackArrrowIcon = (props) => ( <Icon {...props} name='arrow-ios-back-outline'/> )
        
        return(
            <Layout style={{flex: 1}} level="4">
              <ImageBackground source={require('../../assets/LogInBackground.jpeg')} style={{flex: 1}}>
                <SafeAreaView style={{ flex: 1,backgroundColor:"rgba(0,0,0,0.5)" }}>
                  <View style={{flex: 1, justifyContent: "center", alignItems: 'center'}} >
                    <Layout style={{width:'100%', height:'100%', backgroundColor:"rgba(0,0,0,0)"}} level="4">
                      <Layout style={{flex: 1, margin: '5%', opacity: 0.85}} status="basic" header={Header}>
                        {Header()}
                        <View style={{flex: 1, margin: '5%'}}>
                          <Image source={require(`../../assets/ASBA_Logo.png`)} style={styles.image} />
                        </View>
                        <Layout style={{ justifyContent: 'center', alignItems: 'center' }}>
                          <Button style={{width:'100%'}} accessoryLeft={PhoneIcon} appearance="ghost" status="primary" onPress={() => navigation.navigate("PhoneLogin_phone")}>SIGN IN WITH PHONE</Button>
                          <Button style={{width:'100%'}} accessoryLeft={GoogleIcon} appearance="ghost" status="danger" onPress={() => this.signInGoogle()}>SIGN IN WITH GOOGLE</Button>
                          {appleAuth.isSupported && (
                            <AppleButton
                              buttonStyle={AppleButton.Style.BLACK}
                              buttonType={AppleButton.Type.SIGN_IN}
                              style={{
                                width: '100%',
                                height: 50
                              }}
                              onPress={() => this.signInApple()}
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

  const mapStateToProps = state => ({
    user: state.user,
    sessions: state.sessions,
  });
  
  const ActionCreators = Object.assign(
    {},
    {loginUser, logOutUser, syncSessions},
  );
  
  const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(ActionCreators, dispatch),
  });

  export default connect(mapStateToProps, mapDispatchToProps)(LogInScreen_Google);

  const styles = StyleSheet.create({
    popOverContent: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf:'center',
        shadowRadius: 10,
        shadowOpacity: 0.12,
        shadowColor: "#000"
    },
    image: {
      flex:1, 
      width: null,
      height:null,
      resizeMode: 'contain',
      opacity: 0.8
    },
    loginTittle: {
      margin: '5%',
    }
});