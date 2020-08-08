import React, { Component } from 'react';
import { Image, ImageBackground, SafeAreaView } from 'react-native';
import { Button, Layout, Input, Card, Text, Icon, Divider } from '@ui-kitten/components';
import { StyleSheet, View } from 'react-native';
import Axios from "axios";
import {ApiConfig} from "../config/ApiConfig";

import moment from "moment";

import * as GoogleSignIn from 'expo-google-sign-in';

import { connect } from 'react-redux';
import { loginUser, logOutUser } from '../Redux/actions/user.actions';
import { syncSessions } from '../Redux/actions/Session.actions';
import { bindActionCreators } from 'redux';
import { _syncUserSessions, _fetchUserProfile } from '../components/login.component';


class LogInScreen_Google extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
      this.initAsync();
    }

    initAsync = async () => {
        await GoogleSignIn.initAsync({clientId: '688897090799-99bi882h4pkc3vkksl71mm387lgvd2lp.apps.googleusercontent.com'});
        this._syncUserWithStateAsync();
    };

    _syncUserWithStateAsync = async () => {
        const loggedUser = await GoogleSignIn.signInSilentlyAsync();
        if (loggedUser !== null) this._setupUser(loggedUser.email,"gmail");
        else this._rollbackSetupUser();
    };

    _setupUser =  async (userIdentifier, serviceProvider) => {
      const {actions, navigation} = this.props;
      const userProfile = await _fetchUserProfile(userIdentifier, serviceProvider);
      if (userProfile) {
        _syncUserSessions()
          .then(userSessions => {
            actions.loginUser(userProfile);
            actions.syncSessions(userSessions);
            navigation.navigate("HomeRoot");
          }).catch(error => {console.log(error); this._rollbackSetupUser()});
      } else this._rollbackSetupUser();
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

    render() {
        const {navigation} = this.props;

        const navigateDetails = async () => {
            await Axios.get(`${ApiConfig.baseUrl}/auth/login`, {
              params: {
                useridentifier: 'test@gmail.com',
                serviceprovider: 'google'
              }
            })
            .then(res => {
              if (res.status === 200) console.log("Success!", res.data)
              else console.log(res.status, res);
            })
            .catch(e => console.log(e));
            return navigation.navigate('HomeRoot');
          }

        const Header = (props) => (
            <View {...props} style={{margin: "3%"}}>
              <Text category='h6'>Log in</Text>
              <Text category='s1'>America Scores Attendance APP</Text>
            </View>
        );
        const PhoneIcon = (props) => ( <Icon {...props} name='phone-outline'/> );
        const GoogleIcon = (props) => ( <Icon {...props} name='google-outline'/> );
        const WhatsAppIcon = (props) => ( <Icon {...props} name='message-circle-outline'/> )
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