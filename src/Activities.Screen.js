import React, {Component} from "react";
import { Layout, Divider, List, ListItem, Icon, Text, Datepicker } from '@ui-kitten/components';
import { ImageBackground, View } from "react-native";
import Axios from "axios";
import moment from "moment";

import {ApiConfig} from "./config/ApiConfig";

import { connect } from 'react-redux';
import { syncSessions } from "./Redux/actions/Session.actions";
import { bindActionCreators } from 'redux';

class ActivitiesScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            date: moment("2019-09-10").toDate(),
            activities: "",
        }
    }

    componentDidMount() {
        this._syncActivities();
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

    _syncReduxActivities(activitiesList) {
        const { actions } = this.props;
        actions.syncSessions(activitiesList);
        this.setState({activities: activitiesList});
    }

    filterActivitiesByTeamSeasonId(teamSeasonId) {
        const activities = this.state.activities.filter(
            activity => { if (activity.Sessions) return activity.Sessions[0].TeamSeasonId === teamSeasonId; });
        this.setState({activities: activities});
    }

    async fetchActivities() {
        const { user } = this.props;
        return await Axios.get(`${ApiConfig.dataApi}/${user.user.ContactId}/all`, {
            params: {
                // Hardcoded value, change the "2019-08-21" for this.state.date for getting the result in a specific date
                date: moment(this.state.date).format("YYYY-MM-DD")
            }
          })
          .then(res => res.data)
          .catch(e => console.log(e));
    }

    async selectDate(date) { 
        this.setState({date: date})
        const activitiesList = await this.fetchActivities();
        this.props.actions.syncSessions(activitiesList);
    }

    selectActivity(teamSeasonId) { this.props.navigation.navigate("Attendance", {teamSeasonId: teamSeasonId}) }

    render() {
        const CalendarIcon = (props) => ( <Icon {...props} name='calendar'/> );
        const renderItemIcon = (props) => (
            <View style={{flex: 1, flexDirection: 'row', justifyContent:'flex-end'}}>
                <Text  style={{alignSelf:"baseline"}}></Text>
                <Icon {...props} name='people-outline'/> 
                <Icon {...props} name='arrow-ios-forward-outline'/> 
            </View>
        );

        let activityItem = ({ item, index }) => {
            if (item.Sessions === null) return ;
            else {
                return <ListItem
                    title={`${item.Sessions[0].SessionTopic}`}
                    description={`${item.TeamSeasonName}`}
                    accessoryRight={renderItemIcon}
                    onPress={() => this.selectActivity(item.TeamSeasonId)}
            />
            }
        }


        return(
            <Layout style={{ flex: 1, justifyContent: 'center' }}>
                    <Layout style={{margin: "2%"}}>
                        <Datepicker
                            placeholder='Pick Date'
                            date={this.state.date}
                            onSelect={nextDate => this.selectDate(nextDate)}
                            accessoryRight={CalendarIcon}
                        />
                        <Divider/>
                    </Layout>
                    <ImageBackground source={require('../assets/ASBA_Logo.png')} style={{flex: 1}}>
                        <List
                            style={{width:"100%", backgroundColor: "rgba(255,255,255,0.9)"}}
                            data={this.state.activities}
                            ItemSeparatorComponent={Divider}
                            renderItem={activityItem}
                            />
                    </ImageBackground>
            </Layout>                            
        );
    };
};

const mapStateToProps = state => ({ sessions: state.sessions, user: state.user });
  
const ActionCreators = Object.assign( {}, { syncSessions } );
  
const mapDispatchToProps = dispatch => ({ actions: bindActionCreators(ActionCreators, dispatch) });

export default connect(mapStateToProps, mapDispatchToProps)(ActivitiesScreen);