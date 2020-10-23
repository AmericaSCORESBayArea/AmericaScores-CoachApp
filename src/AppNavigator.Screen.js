import React, { Component, useEffect, useState } from "react";

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { LoginStackScreen, HomeRootStackScreen } from "../navigation.component";
import auth from '@react-native-firebase/auth';
import { connect } from 'react-redux';
import { syncSessions } from "./Redux/actions/Session.actions";
import { bindActionCreators } from 'redux';

class AppNavigator extends Component {
    constructor(props) {
        super(props);
        
    }

    componentDidMount() {
            
    }

    
    
    render () { 
        const { Navigator, Screen } = createStackNavigator();
        return (
            <NavigationContainer>
                <Navigator headerMode='none'>
                    {
                        (this.props.islogged.login) ? 
                        <Screen name="HomeRoot" component={HomeRootStackScreen}/>
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
