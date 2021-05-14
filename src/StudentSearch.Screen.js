import React, {Component} from "react";
import { Layout, Divider, List, ListItem, Icon, Text, Datepicker, Card, Button, ButtonGroup, Input} from '@ui-kitten/components';
import { ImageBackground, View, StyleSheet, RefreshControl, ScrollView } from "react-native";
import { MomentDateService } from '@ui-kitten/moment';

import Axios from "axios";
import moment from "moment";

import AsyncStorage from '@react-native-community/async-storage';


import {ApiConfig} from "./config/ApiConfig";

import { connect } from 'react-redux';
import { syncSessions } from "./Redux/actions/Session.actions";
import { updateFirstTimeLoggedIn } from "./Redux/actions/user.actions";
import { bindActionCreators } from 'redux';

class StudentSearchScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: "",
            lastName: "",
            birthDate: moment(),
            grade: "",
            students: "",
        }
    }

    

    async componentDidMount() {
        
    }


    selectStudent(studentId) { this.props.navigation.navigate("Attendance", {teamSeasonId: teamSeasonId}) }
    


    render() {
        const addIcon = (props) => ( <Icon {...props} name='person-add-outline'/> );

        const addButton = () => {
           
                 return <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <ButtonGroup>
                {/* <Button style={{width:"46%"}} status="primary" onPress={() => this.props.navigation.navigate("AddSessionModal", {teamSeasonId: this.state.teamSeasonId})}>+ ADD SESSION</Button> */}
                <Button style={{width:"54%"}} accessoryLeft={addIcon} status="primary" onPress={() => this.props.navigation.navigate("AddStudentToTeamModal", {teamSeasonId: this.state.teamSeasonId})}>ENROLL STUDENT</Button>          
                </ButtonGroup>
                </View>
                
        };
        async function selectDate(date) { 
            await this.setState({birthDate: date})
            const activitiesList = await this.fetchActivities();
            console.log(activitiesList);
        }

        const renderItemIcon = (props) => (
            <View style={{flex: 1, flexDirection: 'row', justifyContent:'flex-end'}}>
                <Text  style={{alignSelf:"baseline"}}></Text>
                <Icon {...props} name='people-outline'/> 
                <Icon {...props} name='arrow-ios-forward-outline'/> 
            </View>
        );

        let activityItem = ({ item, index }) => {
            if (item.Students === null) return ;
            else {
                let studentName = "";
                if (item.FirstName && item.LastName) studentName = item.FirstName + ' ' + item.LastName;

                return <ListItem
                    title={studentName}
                    description={item.Birthdate + " " + item.Grade}
                    accessoryRight={renderItemIcon}
                    onPress={() => this.selectActivity(item.StudentId)}
            />
            
            }
        }
    
        const CalendarIcon = (props) => ( <Icon {...props} name='calendar'/> );
        const dateService = new MomentDateService();
        const searchBox = () => (
            <Datepicker
                placeholder='Pick Date'
                date={this.state.birthDate}
                // min={minDatePickerDate}
                style={{margin: "2%", }}
                dateService={dateService}
                onSelect={nextDate => selectDate(nextDate)}
                accessoryRight={CalendarIcon}
            />
        );
        return(
            <View source={require('../assets/ASBA_Logo.png')} style={{flex: 1}}>
                <Layout style={{ flex: 1, justifyContent: 'center'}}>
                <Text >First Name</Text>
                <Input
                    placeholder='Name'
                    value={this.state.firstName}
                    onChangeText={enteredValue => this.setState({firstName: enteredValue})}
                    size='small'
                />
                <Text >Last Name</Text>
                <Input
                    placeholder='Name'
                    value={this.state.lastName}
                    onChangeText={enteredProgramSiteValue => this.setState({lastName: enteredProgramSiteValue})}
                    size='small'
                />
                <Text>Date of Birth</Text>
                {searchBox()}

                    <ImageBackground source={require('../assets/ASBA_Logo.png')} style={styles.image}>
                        <List
                            style={{opacity: 0.95}}
                            data={this.state.students}
                            renderItem={activityItem}
                            Divider={Divider}
                        />
                        
                    </ImageBackground>
                    {addButton()}
                </Layout>      
            </View>                      
        );
    };
};

const mapStateToProps = state => ({ sessions: state.sessions, user: state.user });
  
const ActionCreators = Object.assign( {}, { syncSessions, updateFirstTimeLoggedIn } );
  
const mapDispatchToProps = dispatch => ({ actions: bindActionCreators(ActionCreators, dispatch) });

export default connect(mapStateToProps, mapDispatchToProps)(StudentSearchScreen);

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
        resizeMode: 'contain',
        opacity: 0.99
    },
});