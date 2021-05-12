import React, {Component} from "react";
import { Layout, Divider, List, ListItem, Icon, Text, Datepicker, Card,  IndexPath, Select, SelectItem } from '@ui-kitten/components';
import { ImageBackground, View, StyleSheet, Image } from "react-native";
import { MomentDateService } from '@ui-kitten/moment';

import Axios from "axios";
import moment from "moment";

import AsyncStorage from '@react-native-community/async-storage';

import {ApiConfig} from "./config/ApiConfig";

import { connect } from 'react-redux';
import { syncSessions } from "./Redux/actions/Session.actions";
import { updateFirstTimeLoggedIn } from "./Redux/actions/user.actions";
import { bindActionCreators } from 'redux';

class ActivitiesScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            date: moment(),
            activities: "",
            welcomeModalVisibility: false,
            nomatchModalVisibility: false,
            regions:[
                'All',
                'San Rafael',
                'San Francisco',
                'Oakland',
            ],
            selectedIndex: "",
            displayedValue: "",
        }
    }

    async componentDidMount() {
        this._syncActivities();
        if (this.props.user.firstTimeLoggedIn) {
            setTimeout(() => (this.setState({welcomeModalVisibility: true})), 500);
            setTimeout(() => {this.setState({welcomeModalVisibility: false})}, 3500);
        }
        console.log(this.props.user);
    }

    _syncActivities() {
        const { route } = this.props;
        //Syncs activities from endpoint
        this.fetchActivities()
            .then(activitiesList => this._syncReduxActivities(activitiesList))    
            .then(() =>{
                //Check if we are in the team activities name
                if (route.name === "Team Activities" && route.params && route.params.teamSeasonId)
                    this.filterActivitiesByTeamSeasonId(route.params.teamSeasonId); // filter the activities for a specific team
            })
            .catch(error => console.log(error));
    }

    //Syncs activitiesToRedux and state
    _syncReduxActivities(activitiesList) {
        const { actions } = this.props;
        actions.syncSessions(activitiesList);
        this.setState({activities: activitiesList});
        activitiesList.map( (value) => ( //here replace teamSeasonName for only TeamName also set Header with the Season
            console.log(value.TeamSeasonName),
            (value.Sessions) === null ? (this.setState({nomatchModalVisibility: true})) : (this.setState({nomatchModalVisibility: false})),
            console.log(value.Sessions)
        ));
    }

    filterActivitiesByTeamSeasonId(teamSeasonId) {
        const activities = this.state.activities.filter(
            activity => { if (activity.Sessions) return activity.Sessions[0].TeamSeasonId === teamSeasonId; });
        this.setState({activities: activities});
    }

    async fetchActivities() {
        const { user } = this.props;
        return await Axios.get(`${ApiConfig.dataApi}/coach/${user.user.ContactId}/all`, {
            params: {
                // Hardcoded value, change the "2019-08-21" for this.state.date for getting the result in a specific date
                date: this.state.date.format("YYYY-MM-DD")
            }
          })
          .then(res => res.data)
          .catch(e => console.log(e));
    }

    async selectDate(date) { 
        await this.setState({date: date})
        const activitiesList = await this.fetchActivities();
        console.log(activitiesList);
        this._syncReduxActivities(activitiesList);
    }

    selectActivity(teamSeasonId) { this.props.navigation.navigate("Attendance", {teamSeasonId: teamSeasonId}) }

    toggleWelcomeModalOff() { 
        const { actions } = this.props;
        this.setState({welcomeModalVisibility: false})
        actions.updateFirstTimeLoggedIn();
    }
    SelectIndex(index){
        this.setState({selectedIndex: index});
        this.setState({displayedValue: this.state.regions[index.row]});
    }
    render() {
        const CalendarIcon = (props) => ( <Icon {...props} name='calendar'/> );
        const renderItemIcon = (props) => (
            <View style={{flex: 1, flexDirection: 'row', justifyContent:'flex-end'}}>
                <Text  style={{alignSelf:"baseline"}}></Text>
                {/*<Icon {...props} name='people-outline'/>*/}
                <Icon {...props} name='calendar-outline'/> 
                <Icon {...props} name='arrow-ios-forward-outline'/> 
            </View>
        );
        const RenderItemImageSW = () => (
            <Image
              style={{ width: 45, height: 45,resizeMode: "contain"}}
              source={require('../assets/Scores_Soccer_and_writing.png')}
            />
          );
        const RenderItemImageS = () => (
                <Image
                style={{ width: 35, height: 35}}
                source={require('../assets/Scores_Ball.png')}
                />
            );
        const RenderItemImageW = () => (
                <Image
                style={{  width: 45, height: 45,resizeMode: "contain"}}
                source={require('../assets/Scores_Pencil_Edit.png')}
                />
        );

        let activityItem = ({ item, index }) => {
            if (item.Sessions === null){
                return; 
            }
            else {
                let sessionTopic = "Unasigned"
                if (item.Sessions[0].SessionTopic) sessionTopic = item.Sessions[0].SessionTopic;
                if(sessionTopic.replace(/_/g,' ') === "Soccer and Writing"){
                    return <ListItem
                        title={`${item.TeamSeasonName}`}
                        style={{backgroundColor: "#C0E4F5"}}
                        /*description={sessionTopic.replace(/_/g,' ')}*/
                        accessoryRight={renderItemIcon}
                        accessoryLeft={RenderItemImageSW}
                        onPress={() => this.selectActivity(item.TeamSeasonId)}
                    />
                }else if(sessionTopic.replace(/_/g,' ') === "Soccer"){
                    return <ListItem
                        title={`${item.TeamSeasonName}`}
                        style={{backgroundColor: "#C0E4F5"}}
                        /*description={sessionTopic.replace(/_/g,' ')}*/
                        accessoryRight={renderItemIcon}
                        accessoryLeft={RenderItemImageS}
                        onPress={() => this.selectActivity(item.TeamSeasonId)}
                    />
                }else if(sessionTopic.replace(/_/g,' ') === "Writing"){
                    return <ListItem
                        title={`${item.TeamSeasonName}`}
                        style={{backgroundColor: "#C0E4F5"}}
                        /*description={sessionTopic.replace(/_/g,' ')}*/
                        accessoryRight={renderItemIcon}
                        accessoryLeft={RenderItemImageW}
                        onPress={() => this.selectActivity(item.TeamSeasonId)}
                    />
                }
                }
        }
        const dateService = new MomentDateService();
        // var date = moment();

        // const minDatePickerDate = moment("20190101", "YYYYMMDD").toDate();

        const searchBox = () => (
            <Datepicker
                placeholder='Pick Date'
                date={this.state.date}
                size='large'
                // min={minDatePickerDate}
                style={{margin: "2%"}}
                dateService={dateService}
                onSelect={nextDate => this.selectDate(nextDate)}
                accessoryRight={CalendarIcon}
            />
        );

        const selectBox = () => (
            <Select
                label="Select a Region"
                placeholder={this.state.regions[0]}
                selectedIndex={this.state.selectedIndex}
                style={{marginBottom:"2%", marginTop:"1%", marginLeft:"2%", marginRight:"2%"}}
                value={this.state.displayedValue}
                onSelect={index => this.SelectIndex(index)}>
                {this.state.regions.map((title,i) =>
                    <SelectItem key={title} title={title}/>
                )}
          </Select>
        );


        const helloMessage = (status) => (
            (
                (this.state.welcomeModalVisibility) &&
                    <Card style={{opacity: 0.9}}>
                        <Text category="s1" status={status} style={{alignSelf: 'center'}}>
                            {this.props.user.user.FirstName} {this.props.user.user.LastName}
                        </Text>
                    </Card>
            )
        );
        const noMatch = (status) => (
            (
                (this.state.nomatchModalVisibility) &&
                <Card style={{opacity: 0.9, backgroundColor:"#C0E4F5"}}>
                    <Text category="s1" status={status} style={{alignSelf: 'center', backgroundColor:"#C0E4F5"}}>
                        There are no active Sessions for the selected date.
                    </Text>
                </Card>
            )
        );

        return(
            <View source={require('../assets/ASBA_Logo.png')} style={{flex: 1}}>
                <Layout style={{ flex: 1, justifyContent: 'center'}}>
                {searchBox()}
                <Divider/>
                {helloMessage("info")}
                {selectBox()}
                {noMatch("basic")}
                    <ImageBackground source={require('../assets/ASBA_Logo.png')} style={styles.image}>
                        <List
                            style={{opacity: 0.95}}
                            data={this.state.activities}
                            renderItem={activityItem}
                            Divider={Divider}
                        />
                    </ImageBackground>
                </Layout>      
            </View>                      
        );
    };
};

const mapStateToProps = state => ({ sessions: state.sessions, user: state.user });
  
const ActionCreators = Object.assign( {}, { syncSessions, updateFirstTimeLoggedIn } );
  
const mapDispatchToProps = dispatch => ({ actions: bindActionCreators(ActionCreators, dispatch) });

export default connect(mapStateToProps, mapDispatchToProps)(ActivitiesScreen);

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