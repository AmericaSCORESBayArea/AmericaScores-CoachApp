import React, { Component, useEffect, useState } from "react";

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { LoginStackScreen, HomeRootStackScreen } from "../navigation.component";
import auth from '@react-native-firebase/auth';
import { connect } from 'react-redux';
import { syncSessions } from "./Redux/actions/Session.actions";
import { bindActionCreators } from 'redux';
import Axios from 'axios';
import {ApiConfig} from "./config/ApiConfig";
import moment from "moment";


class AppNavigator extends Component {
    constructor(props) {
        super(props);
        
    }

    componentDidMount() {
        // var user = auth().currentUser;
        // await Axios.get(`${ApiConfig.baseUrl}/auth/login`, {
        //     params: {
        //       useridentifier: userIdentifier,
        //       serviceprovider: serviceProvider
        //     }
        //     }).then(res => {
        //       if (res.status === 200) console.log("[AUTH FETCH MOBILE LOGIN | 200]", res.data);
        //       const userProfile = res.data;
        //     const _syncUserSessions = async () => {
        //         Axios.get(`${ApiConfig.dataApi}/coach/${user.ContactId}/all`, {
        //             params: {
        //             date: moment()
        //             }
        //         })
        //         .then(res => res.data)
        //         .catch(e => console.log(e));
        //     }
        // }
    }

    
    
    
    
    render () { 
        const { Navigator, Screen } = createStackNavigator();
        return (
            <NavigationContainer>
                <Navigator headerMode='none'>
                    {
                        (this.props.user.logged) ? 
                        <Screen name="HomeRoot" component={HomeRootStackScreen}/> && this._syncUserSessions
                        :
                        <Screen name='Login' component={LoginStackScreen}/>
                    }
                </Navigator>
            </NavigationContainer>
        );
    }
}

const mapStateToProps = state => ({ sessions: state.sessions, user: state.user  });
  
const ActionCreators = Object.assign( {}, { syncSessions } );
  
const mapDispatchToProps = dispatch => ({ actions: bindActionCreators(ActionCreators, dispatch) });

export default connect(mapStateToProps, mapDispatchToProps)(AppNavigator);
